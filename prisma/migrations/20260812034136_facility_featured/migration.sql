-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: feature the two canonical homepage showcase facilities by title (fail-safe:
-- if titles were renamed, zero rows match and the homepage keeps its hardcoded fallback).
UPDATE "Facility" SET "featured" = true
WHERE title IN ('Semiconductor Technology Centre (STC)', '5G & AI Innovation Hub');
