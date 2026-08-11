-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "rawDate" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isPast" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT,
    "microsoftFormUrl" TEXT,
    "agenda" JSONB,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Event_rawDate_idx" ON "Event"("rawDate");

-- CreateIndex
CREATE INDEX "Event_isPast_idx" ON "Event"("isPast");
