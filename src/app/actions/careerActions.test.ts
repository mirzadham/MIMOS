/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createCareerAction,
  updateCareerAction,
  deleteCareerAction,
} from "./careerActions";
import { getSessionAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

// Mock adminAuth
vi.mock("@/lib/adminAuth", () => ({
  getSessionAdmin: vi.fn(),
}));

// Mock DB layer
const mocks = vi.hoisted(() => {
  const optionLists: Record<string, string[]> = {
    CATEGORY: [
      "Development",
      "Design",
      "Marketing",
      "Customer Service",
      "Operations",
      "Finance",
      "Management",
    ],
    EMPLOYMENT_TYPE: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
    LOCATION_MODE: ["Remote", "On-site", "Hybrid"],
  };
  const mockPrisma = {
    career: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  };
  return { optionLists, mockPrisma };
});

vi.mock("@/lib/db", () => ({
  prisma: mocks.mockPrisma,
  getSafeCareerOptions: vi.fn(async (kind?: string) => {
    if (kind) {
      return (
        mocks.optionLists[kind]?.map((name, order) => ({
          id: `opt-${order}`,
          kind,
          name,
          order,
        })) ?? []
      );
    }
    return Object.entries(mocks.optionLists).flatMap(([kind, names]) =>
      names.map((name, order) => ({ id: `opt-${order}`, kind, name, order }))
    );
  }),
}));

describe("Career Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCareerAction", () => {
    it("should reject unauthorized user", async () => {
      (getSessionAdmin as any).mockResolvedValue(null);

      const res = await createCareerAction({
        title: "Software Engineer",
        description: "Develop web apps",
        category: "Development",
        location: "Remote",
        employmentType: "Full-time",
        applyUrl: "https://forms.office.com/r/abc123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe("Unauthorized access");
    });

    it("should reject invalid payload without calling prisma", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });

      const res = await createCareerAction({
        title: "",
        description: "Develop web apps",
        category: "Development",
        location: "Remote",
        employmentType: "Full-time",
        applyUrl: "https://forms.office.com/r/abc123",
      });

      expect(res.success).toBe(false);
      expect(prisma.career.create).not.toHaveBeenCalled();
    });

    it("should reject a non-Microsoft-Form apply URL", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });

      const res = await createCareerAction({
        title: "Software Engineer",
        description: "Develop web apps",
        category: "Development",
        location: "Remote",
        employmentType: "Full-time",
        applyUrl: "https://example.com/jobs",
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/Microsoft Form link/);
      expect(prisma.career.create).not.toHaveBeenCalled();
    });

    it("should reject a mailto apply URL", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });

      const res = await createCareerAction({
        title: "Software Engineer",
        description: "Develop web apps",
        category: "Development",
        location: "Remote",
        employmentType: "Full-time",
        applyUrl: "mailto:careers@mimos.my",
      });

      expect(res.success).toBe(false);
      expect(res.error).toMatch(/Microsoft Form link/);
      expect(prisma.career.create).not.toHaveBeenCalled();
    });

    it("should require a Microsoft Form link", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });

      const res = await createCareerAction({
        title: "Software Engineer",
        description: "Develop web apps",
        category: "Development",
        location: "Remote",
        employmentType: "Full-time",
        applyUrl: "",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe("Microsoft Form link is required.");
      expect(prisma.career.create).not.toHaveBeenCalled();
    });

    it("should reject an unknown category", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });

      const res = await createCareerAction({
        title: "Software Engineer",
        description: "Develop web apps",
        category: "Not-A-Real-Category",
        location: "Remote",
        employmentType: "Full-time",
        applyUrl: "https://forms.office.com/r/abc123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe("Invalid category.");
    });

    it("should reject an unknown employment type", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });

      const res = await createCareerAction({
        title: "Software Engineer",
        description: "Develop web apps",
        category: "Development",
        location: "Remote",
        employmentType: "On call",
        applyUrl: "https://forms.office.com/r/abc123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe("Invalid employment type.");
    });

    it("should reject an unknown location mode", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });

      const res = await createCareerAction({
        title: "Software Engineer",
        description: "Develop web apps",
        category: "Development",
        location: "Kuala Lumpur, Malaysia",
        employmentType: "Full-time",
        applyUrl: "https://forms.office.com/r/abc123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe("Invalid location mode.");
    });

    it("should return failure when the database write fails", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.career.create as any).mockRejectedValue(new Error("DB offline"));

      const res = await createCareerAction({
        title: "Software Engineer",
        description: "Develop web apps",
        category: "Development",
        location: "Remote",
        employmentType: "Full-time",
        applyUrl: "https://forms.office.com/r/abc123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });

    it("should create career listing when authenticated", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.career.count as any).mockResolvedValue(2);
      (prisma.career.create as any).mockResolvedValue({
        id: "c-123",
        title: "Software Engineer",
        description: "Develop web apps",
        category: "Development",
        location: "Remote",
        employmentType: "Full-time",
        applyUrl: "https://forms.office.com/r/abc123",
      });

      const res = await createCareerAction({
        title: "Software Engineer",
        description: "Develop web apps",
        category: "Development",
        location: "Remote",
        employmentType: "Full-time",
        applyUrl: "https://forms.office.com/r/abc123",
      });

      expect(res.success).toBe(true);
      expect(res.data?.id).toBe("c-123");
    });
  });

  describe("updateCareerAction", () => {
    it("should reject unauthorized user", async () => {
      (getSessionAdmin as any).mockResolvedValue(null);

      const res = await updateCareerAction("c-123", {
        title: "Updated Title",
        description: "Updated desc",
        category: "Design",
        location: "On-site",
        employmentType: "Full-time",
        applyUrl: "https://forms.office.com/r/abc123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe("Unauthorized access");
    });

    it("should return failure when the database update fails", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.career.update as any).mockRejectedValue(new Error("DB offline"));

      const res = await updateCareerAction("c-123", {
        title: "Updated Title",
        description: "Updated desc",
        category: "Design",
        location: "On-site",
        employmentType: "Full-time",
        applyUrl: "https://forms.office.com/r/abc123",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });

    it("should update career listing when authenticated", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.career.update as any).mockResolvedValue({
        id: "c-123",
        title: "Updated Title",
      });

      const res = await updateCareerAction("c-123", {
        title: "Updated Title",
        description: "Updated desc",
        category: "Design",
        location: "On-site",
        employmentType: "Full-time",
        applyUrl: "https://forms.office.com/r/abc123",
      });

      expect(res.success).toBe(true);
      expect(res.data?.title).toBe("Updated Title");
    });
  });

  describe("deleteCareerAction", () => {
    it("should reject unauthorized user", async () => {
      (getSessionAdmin as any).mockResolvedValue(null);

      const res = await deleteCareerAction("c-123");
      expect(res.success).toBe(false);
      expect(res.error).toBe("Unauthorized access");
    });

    it("should return failure when the database delete fails", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.career.delete as any).mockRejectedValue(new Error("DB offline"));

      const res = await deleteCareerAction("c-123");
      expect(res.success).toBe(false);
      expect(res.error).toBeDefined();
    });

    it("should delete career listing when authenticated", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.career.delete as any).mockResolvedValue({ id: "c-123" });

      const res = await deleteCareerAction("c-123");
      expect(res.success).toBe(true);
    });
  });
});
