-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('LAB', 'TRAINING_ROOM');

-- AlterTable
ALTER TABLE "Facility" ADD COLUMN     "type" "FacilityType" NOT NULL DEFAULT 'LAB';

-- Backfill: classify training spaces by title (fail-safe: anything unmatched stays LAB,
-- which is the correct default for all existing production labs).
UPDATE "Facility" SET "type" = 'TRAINING_ROOM'
WHERE title IN ('Training & Seminar Rooms');
