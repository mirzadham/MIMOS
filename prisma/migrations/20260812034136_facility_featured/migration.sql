-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false;

-- Backfill: feature the two showcase facilities (matches the current homepage split-pane selection)
UPDATE "Facility" SET "featured" = true WHERE "order" IN (0, 1);
