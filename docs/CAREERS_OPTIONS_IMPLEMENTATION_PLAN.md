# Admin Careers — Category CRUD + Option Selects Implementation Plan

**Status:** ✅ Implemented — pending approval
**Owner:** MIMOS Academy portal maintainers

## Changelog

- **2026-08-11** — `applyUrl` changed to a **required Microsoft Form link** (per follow-up request): field relabeled "Microsoft Form Link" in the admin form, must be an `https://forms.office.com/...` URL (server-validated), mailto/arbitrary URLs rejected. Mock data (SAMPLE_JOBS/mockCareers) updated to forms.office.com URLs. DB column stays nullable (`String?`) to avoid a destructive migration on existing prod rows; the application layer enforces the requirement and the admin edit form forces re-entry of the link.

## 1. Summary

| # | Requirement | Current behavior | Target behavior |
|---|-------------|------------------|-----------------|
| 1 | Career category CRUD in the same admin page | Category is a `<select>` fed from a **static** array (`src/data/careersData.ts`); categories cannot be managed anywhere | Categories are **DB-backed** and manageable (add / rename / delete) via a panel on the existing `/admin/careers` page |
| 2 | Employment type select instead of typing | Free-text `<input>` | `<select>` fed from DB-backed employment type options |
| 3 | Location mode select instead of typing | Free-text `<input>` (stored in `location` column) | `<select>` fed from DB-backed location mode options (Remote / On-site / Hybrid), UI label "Location Mode" |

**Effort:** M · **Risk:** Low–Med (one schema migration; prod deploys via `prisma migrate deploy` only)

## 2. Current State (verified)

- `Career` model (`prisma/schema.prisma` L154–167): `category`, `location`, `employmentType` are free strings.
- Admin page: `src/app/admin/(dashboard)/careers/page.tsx` (server) → `ManageCareersClient.tsx` (client, 440 lines). Category = `<select>` from static `CAREER_CATEGORIES`; employmentType + location = text inputs; filter pills = static array.
- Public page: `/careers` (server, force-dynamic) → `CareersContent` → `JobFilters` (ARIA tabs, static categories) + `JobRow` (renders `location`, `employmentType`).
- `careerActions.ts`: category validated against static whitelist; employmentType/location only length-limited (100/50).
- 14 career action tests; **41 repo tests total, eslint 0 errors, next build green** — must stay green.
- Prod schema changes only via `prisma migrate deploy` on VPS (see handoff mem_20260811_ea8495fc3a434310ba07).

## 3. Design Decisions

### 3.1 One generic option table instead of three
```prisma
enum CareerOptionKind {
  CATEGORY
  EMPLOYMENT_TYPE
  LOCATION_MODE
}

model CareerOption {
  id        String           @id @default(uuid())
  kind      CareerOptionKind
  name      String
  order     Int              @default(0)
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  @@unique([kind, name])
  @@index([kind, order])
}
```
Single table → one CRUD action set, one validation path, one admin panel (3 tabs) for all three requirement items. `@@unique([kind, name])` prevents duplicates per kind.

### 3.2 Keep `Career` columns as strings (no FK, no column rename)
- `category` / `employmentType` / `location` continue to store the **option name**; server-side validation checks membership against the DB options instead of the static whitelist.
- No FK means no cascade problems and **no risky data backfill** for existing `location` values ("100% remote", "Kuala Lumpur, Malaysia").
- Deleting an option that is referenced by ≥1 career is **blocked** with a clear error (count query before delete).
- Renaming an option **migrates careers automatically** (`career.updateMany` where the old name matches) so no career becomes orphaned.

### 3.3 Read-path fallback (repo convention)
`getSafeCareerOptions(kind?)` returns DB rows; on query failure **or empty table** falls back to static defaults (same pattern as `getSafeCareers`). Public page and admin form never break on an unmigrated DB; server action validation uses the same helper.

### 3.4 Seeding — defaults shipped in the migration itself
Idempotent `INSERT ... ON CONFLICT DO NOTHING` inside `migration.sql` (prod-safe, works with `migrate deploy`), mirrored in `prisma/seed.ts` for local dev:

- **CATEGORY:** Development, Design, Marketing, Customer Service, Operations, Finance, Management (existing 7; "View all" is a UI concept, never stored)
- **EMPLOYMENT_TYPE:** Full-time, Part-time, Contract, Internship, Freelance
- **LOCATION_MODE:** Remote, On-site, Hybrid

### 3.5 Legacy value handling in edit modal
If an existing career's `location` is not in the current option list, normalize on modal open: values containing "remote" → "Remote", else → "On-site" (first option). Admin consciously re-saves; a small hint line in the modal explains the substitution.

## 4. Implementation Steps (each independently verifiable)

### Step 1 — Schema + migration
- `prisma/schema.prisma`: add `CareerOption` model + `CareerOptionKind` enum.
- New `prisma/migrations/<ts>_add_career_options/migration.sql`: `CREATE TYPE` + `CREATE TABLE` + idempotent seed inserts.
- `prisma/seed.ts`: mirror the option seeds (local dev convenience).
- Verify: `npx prisma migrate dev` on local `mydb`; `prisma migrate diff` sanity check.

### Step 2 — Data layer
- `src/data/careersData.ts`: add `DEFAULT_EMPLOYMENT_TYPES`, `DEFAULT_LOCATION_MODES`; keep `CAREER_CATEGORIES` (now documented as fallback defaults); loosen `JobListing.category` type from literal union → `string`.
- `src/lib/db.ts`: add `getSafeCareerOptions(kind?)` + exported `CareerOptionItem` type; normalize `mockCareers` location values to modes ("Remote"/"On-site") for consistency.
- Verify: `npm test` still green (mocks unaffected or updated).

### Step 3 — Server actions
- **New** `src/app/actions/careerOptionActions.ts` (follows `careerActions.ts` conventions: `getSessionAdmin`, audit log, revalidate with `{ expire: 0 }`):
  - `createCareerOptionAction(kind, name)` — auth, trim, ≤50 chars, duplicate check (findUnique + catch P2002)
  - `updateCareerOptionAction(id, name)` — same validation; **plus** `career.updateMany` to rebind careers using the old name
  - `deleteCareerOptionAction(id)` — usage count per kind; block with `"X position(s) use this ..."` if > 0; else delete
- `careerActions.ts`: make `validateCareerData` async; validate `category` / `employmentType` / `location` against `getSafeCareerOptions` (same helper used by reads, so fallback stays consistent). Length limits unchanged.
- Verify: new `careerOptionActions.test.ts` (unauthorized / empty / duplicate / rename-rebind / delete-in-use blocked / delete-ok / audit+revalidate); extend `careerActions.test.ts` (invalid employment type & location rejected, valid passes).

### Step 4 — Admin UI (all changes on the existing `/admin/careers` page)
- `src/app/admin/(dashboard)/careers/page.tsx`: fetch options via `getSafeCareerOptions`, pass `initialOptions` to client.
- `ManageCareersClient.tsx`:
  - **New "Career Options" panel** (bordered card between header and listings) with 3 tabs: Categories / Employment Types / Location Modes.
  - Each tab: inline add row (input + Add button) · option list with inline rename (edit icon → input + save/cancel) · delete via existing `useConfirm` dialog; errors via existing `useToast`.
  - Career form modal: `employmentType` and `location` inputs → `<select>`s (label "Location Mode"); category select fed from DB options; legacy-value normalization on edit.
  - Category filter pills: "View all" + DB categories.
  - Single `options` state array, updated optimistically after each action (mirrors existing careers state pattern).
- Verify: manual smoke on `/admin/careers` — add/rename/delete category, create career with selects, see pills update.

### Step 5 — Public careers page
- `src/app/(public)/careers/page.tsx`: fetch categories, pass to `CareersContent`.
- `CareersContent.tsx`: accept `categories?: string[]` (fallback `CAREER_CATEGORIES`), derive tabs.
- `JobFilters.tsx`: prop-driven `categories` array instead of static import (keeps ARIA tabs/keyboard pattern intact).
- Verify: `/careers` renders DB categories; a category added in admin appears as a filter tab after revalidation.

### Step 6 — Verification gate
- `npm test` (41 existing + ~10 new) · `npm run lint` (0 errors) · `npx tsc --noEmit` · `npm run build`.
- Local DB: `npx prisma migrate dev`.
- **Prod:** `prisma migrate deploy` on VPS (never `db push` — see handoff note); seed inserts in migration make prod defaults automatic.

## 5. Files Touched

| File | Change |
|------|--------|
| `prisma/schema.prisma` | +`CareerOption`, +`CareerOptionKind` |
| `prisma/migrations/<ts>_add_career_options/migration.sql` | new (table + idempotent seed) |
| `prisma/seed.ts` | +option seeds |
| `src/data/careersData.ts` | +defaults, type loosening |
| `src/lib/db.ts` | +`getSafeCareerOptions`, mock normalization |
| `src/app/actions/careerOptionActions.ts` | **new** |
| `src/app/actions/careerActions.ts` | async DB-backed validation |
| `src/app/actions/careerOptionActions.test.ts` | **new** |
| `src/app/actions/careerActions.test.ts` | extended mocks + cases |
| `src/app/admin/(dashboard)/careers/page.tsx` | fetch + pass options |
| `src/components/admin/ManageCareersClient.tsx` | options panel + selects |
| `src/app/(public)/careers/page.tsx` | fetch categories |
| `src/components/careers/CareersContent.tsx` | prop-driven categories |
| `src/components/careers/JobFilters.tsx` | prop-driven categories |

## 6. Risks & Notes

- **Prod migration discipline:** schema change ships as a proper migration; deploy on VPS with `prisma migrate deploy`. Do not use `db push`.
- **No FK on option references:** deletion race is possible (career created between count check and delete) — acceptable for an internal CMS; validation still requires names to exist at write time.
- **"View all"** stays a UI-only concept; never persisted.
- **Pre-existing TS7006 implicit-any** in ~10 app-dir pages (main too) — do not "fix" in this PR.
- Keep all existing UI conventions: `useToast`, `useConfirm`, admin shell, audit logs, `revalidateTag("cms-content", { expire: 0 })`.

## 7. Out of Scope (future)

- Option reordering (schema has `order` for future up/down controls).
- Per-option archive/deactivate toggle (`isActive` can be added later if needed).
- Location-mode filtering on the public page.
