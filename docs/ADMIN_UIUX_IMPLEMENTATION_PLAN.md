# Admin Panel UI/UX Implementation Plan — High-Impact Batch

**Scope:** The 5 high-impact items identified in the audit.
**Status:** ✅ Implemented — Phases 0–5 complete (see changelog below).
**Owner:** MIMOS Academy portal maintainers.

## Implementation Changelog

- **Phase 0** — Added `ui/toast.tsx` (Base UI Toast wrapper), `ui/confirm-dialog.tsx` (Base UI AlertDialog + promise API), `admin/AdminProviders.tsx`.
- **Phase 1** — Added `admin/AdminSidebar.tsx` with `usePathname()` active states; `layout.tsx` slimmed to auth + providers + shell.
- **Phase 2** — All 9 clients wired to `useToast()`; native `alert()` removed (0 remaining).
- **Phase 3** — All native `confirm()` replaced with styled dialogs (0 remaining); dialog shows busy spinner while the action runs and errors inline on failure.
- **Phase 4** — Row-level pending state on News highlight toggles (spinner + disable); deletes use the dialog's built-in busy state.
- **Phase 5** — `admin/AdminShell.tsx`: mobile drawer + topbar, desktop collapsible rail (localStorage-persisted), active link indicator.
- **Note:** CRUD server actions never return `error` (they fall back to mock data), so client error toasts use generic messages; only the highlight toggle surfaces its specific error.

**Verification:** `tsc --noEmit` clean · `npm run lint` 0 errors · `npm run test` 27/27 · `npm run build` OK · runtime smoke test: all 10 authenticated admin routes return 200, active nav rendered server-side.

---

## 0. Summary

| # | Item | Effort | Risk |
|---|------|--------|------|
| 0 | Shared UI foundation (Toast + ConfirmDialog kit) | M | Low |
| 1 | Active sidebar navigation state | S | Low |
| 2 | Toast feedback system (replace `alert()`, add success toasts) | M | Low |
| 3 | Confirm dialog (replace native `confirm()`) | M | Low |
| 4 | Row-level pending states + optimistic updates | M–L | Med |
| 5 | Responsive / collapsible sidebar | M | Med |

All phases touch the same 9 client components, so the **shared foundation (Phase 0) is built first** and every later phase consumes it. No DB schema changes, no server-action signature changes, no public-site changes.

---

## Architecture Decisions

1. **Use `@base-ui/react` primitives, not hand-rolled ones.**
   `@base-ui/react@1.6.0` is already installed and used (`src/components/ui/button.tsx`). Its `Toast` and `AlertDialog` ship accessible focus-trap, `Esc` handling, `aria-*` wiring, and viewport stacking for free. We wrap them in thin, styled components matching the existing design tokens (slate cards, `rounded-2xl`, `text-xs`).
2. **Provider placement.** `Toast.Provider` must wrap every component that can fire a toast → render it in a new client `AdminProviders` inside the dashboard `layout.tsx` (the layout itself stays a server component for auth).
3. **Promise-based confirm API.** `const ok = await confirm({...})` keeps all existing delete handlers structurally identical — the change is a one-line swap per call site.
4. **Toasts fire *after* the server action resolves**, never optimistically. Optimism is reserved for list data (Phase 4.2).
5. **No styling regressions.** The existing look (white cards, `border-slate-200`, `bg-primary`) is the target visual language for new components.

---

## Phase 0 — Shared UI Foundation

### Files

| File | Type | Purpose |
|------|------|---------|
| `src/components/ui/toast.tsx` | **new** | Styled Base UI `Toast` wrapper + `useToast()` hook with `.success() / .error() / .info()` |
| `src/components/ui/confirm-dialog.tsx` | **new** | Base UI `AlertDialog` wrapper + `useConfirm()` context hook |
| `src/components/admin/AdminProviders.tsx` | **new** | Client component: `<Toast.Provider>{children}</Toast.Provider>` |
| `src/app/admin/(dashboard)/layout.tsx` | modify | Wrap `<main>` content in `<AdminProviders>` |

### Toast API

```tsx
const { toast } = useToast();
toast.success("Article deleted");               // emerald, CheckCircle2, auto-dismiss 4s
toast.error("Failed to upload image.");          // red, AlertCircle, auto-dismiss 6s
toast.info("Already 4 highlights selected.");    // slate/primary, Info, auto-dismiss 4s
```

Design:
- Top-right viewport (`fixed top-6 right-6`), `z-[100]`, slide/fade in via `tw-animate-css`.
- Variants via a `variant` prop → `cva` classes (mirrors `button.tsx` pattern).
- `role="status"` for success/info, `role="alert"` for errors; dismiss button; pause auto-dismiss on hover (Base UI built-in).
- **Replaces** the bespoke red-only `showToast` currently inside `ManageNewsClient`.

### ConfirmDialog API

```tsx
const confirm = useConfirm();
const ok = await confirm({
  title: "Delete news article?",
  message: `"${title}" will be permanently removed. This cannot be undone.`,
  confirmLabel: "Delete",
  cancelLabel: "Cancel",
  danger: true,          // red confirm button
});
if (!ok) return;
```

Design:
- Renders one `<AlertDialog>` at a time via a queue in a context provider.
- `Esc` / backdrop click / Cancel → resolves `false`; confirm → resolves `true`.
- Loading state on the confirm button while the delete action runs (spinner + disabled), so the dialog stays open until the action completes — fixes the current "delete then guess if it worked" gap.
- Focus returns to the trigger button on close (Base UI default).

### Acceptance criteria
- `useToast()` and `useConfirm()` work in any dashboard page without per-page setup.
- Toast variants visually distinct; errors announced (`role="alert"`).
- `npm run lint` and `npm run test` pass (no existing tests touch these paths).

---

## Phase 1 — Active Sidebar Navigation

### Problem
`layout.tsx` renders nav links with no `usePathname()` check — no indication of the current section.

### Files

| File | Type | Purpose |
|------|------|---------|
| `src/components/admin/AdminSidebar.tsx` | **new** | Client sidebar: links, active state, user banner, logout |
| `src/app/admin/(dashboard)/layout.tsx` | modify | Replace inline `<aside>` with `<AdminSidebar adminEmail={admin.email} />` (pass data from server layout as props) |

### Implementation steps
1. Move the existing `<aside>` markup into `AdminSidebar` verbatim.
2. Add `const pathname = usePathname();` (already used elsewhere in the app, e.g. `Header.tsx`).
3. Active link style (exact match on `link.href`):
   - `bg-primary/5 text-primary` pill + left 2px indicator bar
   - Icon `text-primary`, chevron visible
   - `aria-current="page"`
4. Keep hover styles for inactive links; add `title` for truncation.

### Acceptance criteria
- Navigating to each section visibly highlights the corresponding nav item.
- Page load at `/admin/news` highlights "Manage News" (server-render parity — no flash).

---

## Phase 2 — Toast Feedback Everywhere

### Problem
All mutations close the modal with **zero success feedback**; failures surface via inline red boxes or `alert()`. `ManageNewsClient` has a bespoke red-only toast.

### Files (all modified)
| File | Changes |
|------|---------|
| `ManagePartnersClient.tsx` | Delete success/error toasts; `alert()` → `toast.error()` |
| `ManageTestimonialsClient.tsx` | Same pattern |
| `ManageWhyChooseUsClient.tsx` | Same pattern |
| `ManageStatsClient.tsx` | Same pattern (also replace file-size error `setError` → `toast.error`) |
| `ManageAboutClient.tsx` | Same pattern |
| `ManageFacilitiesClient.tsx` | Same pattern |
| `ManageProgramsClient.tsx` | Same pattern |
| `ManageNewsClient.tsx` | **Remove local `showToast`/`toastMessage` state + red toast JSX**; use shared `useToast` |
| `ManageNewsClient.tsx` | Add success toast after highlight toggle |

### Rules of thumb
- **Success toast** after: create, update, delete, toggle (e.g. "Article deleted", "Program updated").
- **Error toast** on: action failure, image upload failure, file-size validation (>5MB).
- **Inline errors stay** for *form validation* inside the modal (field-level context beats a toast); toasts are for async outcomes.
- `alert()` → `toast.error()`; `confirm()` handled in Phase 3.

### Acceptance criteria
- Create/Edit/Delete each entity shows a green confirmation toast on success.
- Every failure path shows a red toast; no native `alert()` remains (grep `alert(` = 0 in `src/components/admin/`).
- No double-toast (modal closes + toast fires once).

---

## Phase 3 — Confirm Dialogs

### Problem
8 `confirm()` calls across 7 files — native, unstylable, no branding.

### Files (all modified)
Same 8 client files + any page with delete (e.g. `events/page.tsx` if it inlines a client — verify during implementation).

### Steps (per file)
1. `const confirm = useConfirm();`
2. `handleDelete` becomes async:

   ```tsx
   const handleDelete = async (id: string, name: string) => {
     const ok = await confirm({
       title: `Delete ${entity}?`,
       message: `"${name}" will be permanently removed.`,
       confirmLabel: "Delete",
       danger: true,
     });
     if (!ok) return;
     // existing startTransition logic…
   };
   ```
3. Dialog shows per-row pending state (see Phase 4) while the delete action runs.

### Acceptance criteria
- `grep confirm(` in `src/components/admin/` returns **0** (native usage gone).
- Deleting any entity requires an explicit styled confirmation; cancel does nothing.
- Delete flow keeps dialog open + spinner until server action resolves, then closes with a success toast (Phase 2).

---

## Phase 4 — Row-Level Pending States & Optimistic Updates

### Problem
`useTransition` exists but only disables submit buttons. During a delete/toggle, the row is static and unresponsive; after action completes, the list only updates after the server round-trip.

### 4.1 Row-level pending affordance (all lists)
- Add per-row state: `const [pendingRow, setPendingRow] = useState<{ id: string; action: "delete" | "toggle" | "edit" } | null>(null);`
- While `pendingRow.id === row.id`:
  - Disable that row's Edit/Delete/star buttons
  - Replace trash icon with a spinner (`Loader2` with `animate-spin`) in the Delete button; label "Deleting…"
  - Dim row (`opacity-60`)
- Clear `pendingRow` in `finally`.
- Prevents double-submits without globally disabling the whole list (current behavior).

### 4.2 Optimistic updates (simple lists only — optional stretch)
Apply **only** to lists where order/derived state isn't involved and rollback is trivial:
- `ManagePartnersClient`, `ManageTestimonialsClient`, `ManageWhyChooseUsClient`
- Pattern: remove row from local state immediately on delete-confirm; on action error, re-insert via `router.refresh()` + error toast (server is source of truth).

Explicitly **not** optimistic:
- `ManageNewsClient` (highlight slots + ordering invariants)
- `ManageProgramsClient` (order/price derived UI)
- `ManageStatsClient` (counts derived from multiple tables)

### Acceptance criteria
- Clicking Delete on a row shows an in-row spinner; no other row's buttons are affected.
- Double-clicking Delete/star cannot fire two actions.
- Optimistic lists (4.2): row disappears instantly on confirm; reappears with error toast if the action fails.

---

## Phase 5 — Responsive / Collapsible Sidebar

### Problem
`min-h-screen flex` + fixed `w-64` sidebar — broken below ~768px, no collapse option on desktop.

### Files
| File | Type | Purpose |
|------|------|---------|
| `src/components/admin/AdminSidebar.tsx` | modify | Collapsible state + mobile drawer |
| `src/app/admin/(dashboard)/layout.tsx` | modify | Add topbar (hamburger + page title) on mobile; `lg:` breakpoint container |

### Implementation steps
1. **Desktop collapse:** toggle button (top-right of sidebar) switches between `w-64` (full, icons+labels) and `w-[72px]` (icons only, `title` tooltips, labels hidden). Persist choice in `localStorage` (`mimos:sidebar:collapsed`).
2. **Mobile (< `lg`):** sidebar becomes an off-canvas drawer:
   - Hidden by default; hamburger in a sticky topbar toggles it
   - Backdrop (`bg-slate-950/40 backdrop-blur-sm`) closes on click; `Esc` closes
   - Active nav item auto-highlights (Phase 1 carries over)
3. Topbar: sticky, `h-14`, hamburger (mobile only), current page title, right-aligned admin email/avatar (relocate from sidebar banner on mobile).
4. `main` content: `px-4 sm:px-8` and `max-w-6xl mx-auto` retained; add `lg:pl-0` handling so content uses the freed space when collapsed.

### Acceptance criteria
- At 375px viewport: drawer opens/closes, backdrop works, no horizontal scroll, all nav items reachable.
- Desktop: collapse to icon rail; state persists across reloads; active item still visible in icon mode (colored icon + indicator).
- Logout remains reachable in all modes.

---

## Verification Strategy

Run after each phase, full pass at the end:

```bash
npm run lint   # eslint
npm run test   # vitest (adminActions.test.ts, adminAuth.test.ts, aboutActions.test.ts — UI-only changes must not break these)
npm run build  # next build (catches RSC/client boundary errors, e.g. providers in layout)
```

### Manual QA checklist (localhost)
1. `/admin/login` → login → land on `/admin` with Overview nav active.
2. Visit all 9 sections; active nav tracks URL; mobile viewport drawer works.
3. Create/edit/delete one item in each section → green success toast; error path (e.g. >5MB upload) → red toast.
4. Delete flow: styled dialog → spinner in confirm button → success toast; Esc/Cancel → nothing happens.
5. Highlight toggle in News: star updates, row spinner, success toast, `4/4` cap warning still enforced.
6. Collapse sidebar → reload → still collapsed; navigate with icons-only.
7. Audit log on Overview still renders; stats cards still count.

---

## Risks & Notes

| Risk | Mitigation |
|------|-----------|
| Base UI Toast/AlertDialog APIs differ from assumed API | Verify exports in `node_modules/@base-ui/react/toast` + `alert-dialog` at start of Phase 0 |
| Moving sidebar to a client component breaks RSC props | Pass `admin.email` explicitly; keep auth/redirect in the server layout |
| Toast fires but modal still open (action not awaited) | Fire toast only after `res.success`, before `setIsOpen(false)` |
| Double toast from NewsClient's legacy `showToast` | Delete legacy state/JSX in the same edit as wiring the new hook |
| Optimistic rollback (4.2) desyncs with server | Restrict to 3 simple lists; always `router.refresh()` on error; server remains source of truth |
| Scope creep (modal a11y refactor to Base UI Dialog) | **Out of scope** — record as follow-up: convert the 9 custom modals to Base UI `Dialog` for free focus-trap/Esc; separate batch |

## Out of Scope (next batches)
- Search / filter / pagination on tables (medium-impact item)
- Richer Overview dashboard (events/partners counts, activity chart)
- Modal a11y refactor to Base UI `Dialog`
- ⌘K command palette, drag-and-drop reordering, dark mode
