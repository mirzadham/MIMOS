-- CreateEnum
CREATE TYPE "CareerOptionKind" AS ENUM ('CATEGORY', 'EMPLOYMENT_TYPE', 'LOCATION_MODE');

-- CreateTable
CREATE TABLE "CareerOption" (
    "id" TEXT NOT NULL,
    "kind" "CareerOptionKind" NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CareerOption_kind_name_key" ON "CareerOption"("kind", "name");

-- CreateIndex
CREATE INDEX "CareerOption_kind_order_idx" ON "CareerOption"("kind", "order");

-- Seed default career options (idempotent; safe to run via `prisma migrate deploy`).
-- These defaults mirror src/data/careersData.ts so a freshly migrated database
-- always has a usable option set. "View all" is a UI-only concept and is never stored.
INSERT INTO "CareerOption" ("id", "kind", "name", "order", "createdAt", "updatedAt") VALUES
    ('cat-development', 'CATEGORY', 'Development', 0, NOW(), NOW()),
    ('cat-design', 'CATEGORY', 'Design', 1, NOW(), NOW()),
    ('cat-marketing', 'CATEGORY', 'Marketing', 2, NOW(), NOW()),
    ('cat-customer-service', 'CATEGORY', 'Customer Service', 3, NOW(), NOW()),
    ('cat-operations', 'CATEGORY', 'Operations', 4, NOW(), NOW()),
    ('cat-finance', 'CATEGORY', 'Finance', 5, NOW(), NOW()),
    ('cat-management', 'CATEGORY', 'Management', 6, NOW(), NOW()),
    ('et-full-time', 'EMPLOYMENT_TYPE', 'Full-time', 0, NOW(), NOW()),
    ('et-part-time', 'EMPLOYMENT_TYPE', 'Part-time', 1, NOW(), NOW()),
    ('et-contract', 'EMPLOYMENT_TYPE', 'Contract', 2, NOW(), NOW()),
    ('et-internship', 'EMPLOYMENT_TYPE', 'Internship', 3, NOW(), NOW()),
    ('et-freelance', 'EMPLOYMENT_TYPE', 'Freelance', 4, NOW(), NOW()),
    ('lm-remote', 'LOCATION_MODE', 'Remote', 0, NOW(), NOW()),
    ('lm-on-site', 'LOCATION_MODE', 'On-site', 1, NOW(), NOW()),
    ('lm-hybrid', 'LOCATION_MODE', 'Hybrid', 2, NOW(), NOW())
ON CONFLICT ("kind", "name") DO NOTHING;
