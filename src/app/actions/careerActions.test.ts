/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getCareersAction,
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
vi.mock("@/lib/db", () => {
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
  return {
    prisma: mockPrisma,
    mockCareers: [
      {
        id: "mock-1",
        title: "Mock Job",
        description: "Mock desc",
        category: "Development",
        location: "Remote",
        employmentType: "Full-time",
        applyUrl: null,
      },
    ],
    setMockCareers: vi.fn(),
  };
});

describe("Career Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getCareersAction", () => {
    it("should return careers list on success", async () => {
      const mockList = [{ id: "c1", title: "Dev" }];
      (prisma.career.findMany as any).mockResolvedValue(mockList);

      const res = await getCareersAction();
      expect(res.success).toBe(true);
      expect(res.data).toEqual(mockList);
    });

    it("should return mock fallback if database query fails", async () => {
      (prisma.career.findMany as any).mockRejectedValue(new Error("DB offline"));

      const res = await getCareersAction();
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
    });
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
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe("Unauthorized access");
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
      });

      const res = await createCareerAction({
        title: "Software Engineer",
        description: "Develop web apps",
        category: "Development",
        location: "Remote",
        employmentType: "Full-time",
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
        location: "Kuala Lumpur",
        employmentType: "Full-time",
      });

      expect(res.success).toBe(false);
      expect(res.error).toBe("Unauthorized access");
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
        location: "Kuala Lumpur",
        employmentType: "Full-time",
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

    it("should delete career listing when authenticated", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.career.delete as any).mockResolvedValue({ id: "c-123" });

      const res = await deleteCareerAction("c-123");
      expect(res.success).toBe(true);
    });
  });
});
