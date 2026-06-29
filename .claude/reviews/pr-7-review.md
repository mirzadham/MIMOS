# PR Review: #7 — feat: integrate Cloudflare R2 image upload and preview

**Reviewed**: 2026-06-29
**Author**: mirzadham
**Branch**: feat/r2-image-upload → main
**Decision**: APPROVE

## Summary
The pull request integrates Cloudflare R2 object storage for course image/poster uploads in MIMOS Academy. It implements the presigned URL pattern for direct client-to-R2 uploads, keeping the Next.js server fast and stateless. It also configures the Prisma 7 PostgreSQL driver adapter to support direct connections. The code compiles successfully with no TypeScript errors or ESLint errors.

## Findings

### CRITICAL
None.

### HIGH
None.

### MEDIUM
None.

### LOW
- **Image Optimization (4 Warnings):** ESLint flags the usage of native `<img>` tags instead of Next.js `<Image />` components. Because these images are retrieved dynamically from a dynamically configured R2 bucket subdomain (`pub-*.r2.dev`), using Next.js `<Image />` would require configuring `remotePatterns` dynamically or using a custom loader. Raw `<img>` is acceptable here, but adding `// eslint-disable-next-line @next/next/no-img-element` will quiet down warnings if desired.

## Validation Results

| Check | Result |
|---|---|
| Type check | Pass |
| Lint | Pass (with minor image warnings) |
| Tests | Skipped (none configured) |
| Build | Pass |

## Files Reviewed
- [NEW] `src/app/api/upload/route.ts`
- [NEW] `src/lib/r2.ts`
- [MODIFY] `package.json`
- [MODIFY] `package-lock.json`
- [MODIFY] `prisma/schema.prisma`
- [MODIFY] `prisma/seed.ts`
- [MODIFY] `src/app/(public)/programs/[slug]/page.tsx`
- [MODIFY] `src/app/actions/adminActions.ts`
- [MODIFY] `src/components/admin/ManageProgramsClient.tsx`
- [MODIFY] `src/components/landing/ProgramCard.tsx`
- [MODIFY] `src/lib/db.ts`
