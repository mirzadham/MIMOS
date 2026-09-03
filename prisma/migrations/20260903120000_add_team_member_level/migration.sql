-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN "level" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "TeamMember_level_order_idx" ON "TeamMember"("level", "order");
