/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createCareerOptionAction,
  updateCareerOptionAction,
  deleteCareerOptionAction,
} from "./careerOptionActions";
import { getSessionAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";

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
  const mockPrisma = {
    careerOption: {
      findUnique: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    career: {
      count: vi.fn(),
      updateMany: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  };
  return { mockPrisma };
});

vi.mock("@/lib/db", () => ({
  prisma: mocks.mockPrisma,
}));

const existingOption = {
  id: "opt-1",
  kind: "CATEGORY",
  name: "Development",
  order: 0,
};

describe("Career Option Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createCareerOptionAction", () => {
    it("should reject unauthorized user", async () => {
      (getSessionAdmin as any).mockResolvedValue(null);

      const res = await createCareerOptionAction("CATEGORY", "Design");
      expect(res.success).toBe(false);
      expect(res.error).toBe("Unauthorized access");
      expect(prisma.careerOption.create).not.toHaveBeenCalled();
    });

    it("should reject an invalid kind", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });

      const res = await createCareerOptionAction("NOT_A_KIND", "Design");
      expect(res.success).toBe(false);
      expect(res.error).toBe("Invalid option type.");
      expect(prisma.careerOption.create).not.toHaveBeenCalled();
    });

    it("should reject an empty name", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });

      const res = await createCareerOptionAction("CATEGORY", "   ");
      expect(res.success).toBe(false);
      expect(res.error).toBe("Option name is required.");
      expect(prisma.careerOption.create).not.toHaveBeenCalled();
    });

    it("should reject a duplicate name for the same kind", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any).mockResolvedValue(existingOption);

      const res = await createCareerOptionAction("CATEGORY", "Development");
      expect(res.success).toBe(false);
      expect(res.error).toBe('"Development" already exists.');
      expect(prisma.careerOption.create).not.toHaveBeenCalled();
    });

    it("should reject the reserved 'View all' name", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });

      const res = await createCareerOptionAction("CATEGORY", "View all");
      expect(res.success).toBe(false);
      expect(res.error).toBe('"View all" is reserved and cannot be used as an option name.');
      expect(prisma.careerOption.create).not.toHaveBeenCalled();
    });

    it("should surface a friendly error when a concurrent duplicate hits the unique constraint", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any).mockResolvedValue(null);
      (prisma.careerOption.count as any).mockResolvedValue(7);
      (prisma.careerOption.create as any).mockRejectedValue({ code: "P2002" });

      const res = await createCareerOptionAction("CATEGORY", "QA");
      expect(res.success).toBe(false);
      expect(res.error).toBe('"QA" already exists.');
    });

    it("should create an option when authenticated", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any).mockResolvedValue(null);
      (prisma.careerOption.count as any).mockResolvedValue(7);
      (prisma.careerOption.create as any).mockResolvedValue({
        id: "opt-new",
        kind: "CATEGORY",
        name: "QA",
        order: 7,
      });

      const res = await createCareerOptionAction("CATEGORY", "QA");
      expect(res.success).toBe(true);
      expect(res.data?.id).toBe("opt-new");
      expect(prisma.careerOption.create).toHaveBeenCalledWith({
        data: { kind: "CATEGORY", name: "QA", order: 7 },
      });
      expect(prisma.auditLog.create).toHaveBeenCalled();
      expect(revalidateTag).toHaveBeenCalled();
    });
  });

  describe("updateCareerOptionAction", () => {
    it("should reject unauthorized user", async () => {
      (getSessionAdmin as any).mockResolvedValue(null);

      const res = await updateCareerOptionAction("opt-1", "Design");
      expect(res.success).toBe(false);
      expect(res.error).toBe("Unauthorized access");
    });

    it("should reject an unknown option id", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any).mockResolvedValue(null);

      const res = await updateCareerOptionAction("nope", "Design");
      expect(res.success).toBe(false);
      expect(res.error).toBe("Option not found.");
    });

    it("should reject renaming to an existing name", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any)
        .mockResolvedValueOnce(existingOption) // the option being renamed
        .mockResolvedValueOnce({ id: "opt-2", kind: "CATEGORY", name: "Design" }); // duplicate

      const res = await updateCareerOptionAction("opt-1", "Design");
      expect(res.success).toBe(false);
      expect(res.error).toBe('"Design" already exists.');
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("should reject renaming to the reserved 'View all' name", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });

      const res = await updateCareerOptionAction("opt-1", "View all");
      expect(res.success).toBe(false);
      expect(res.error).toBe('"View all" is reserved and cannot be used as an option name.');
      expect(prisma.careerOption.findUnique).not.toHaveBeenCalled();
    });

    it("should surface a friendly error when a concurrent rename hits the unique constraint", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any)
        .mockResolvedValueOnce(existingOption) // the option being renamed
        .mockResolvedValueOnce(null); // duplicate check
      (prisma.$transaction as any).mockRejectedValue({ code: "P2002" });

      const res = await updateCareerOptionAction("opt-1", "Software");
      expect(res.success).toBe(false);
      expect(res.error).toBe('"Software" already exists.');
    });

    it("should treat a same-name rename as a no-op success", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any).mockResolvedValue(existingOption);

      const res = await updateCareerOptionAction("opt-1", "Development");
      expect(res.success).toBe(true);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it("should rename the option and rebind careers using the old name", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any)
        .mockResolvedValueOnce(existingOption) // the option being renamed
        .mockResolvedValueOnce(null); // duplicate check
      (prisma.careerOption.update as any).mockResolvedValue({
        id: "opt-1",
        kind: "CATEGORY",
        name: "Software",
        order: 0,
      });
      (prisma.career.updateMany as any).mockResolvedValue({ count: 2 });
      (prisma.$transaction as any).mockResolvedValue([
        { id: "opt-1", kind: "CATEGORY", name: "Software", order: 0 },
        { count: 2 },
      ]);

      const res = await updateCareerOptionAction("opt-1", "Software");
      expect(res.success).toBe(true);
      expect(res.data?.name).toBe("Software");
      expect(prisma.careerOption.update).toHaveBeenCalledWith({
        where: { id: "opt-1" },
        data: { name: "Software" },
      });
      expect(prisma.career.updateMany).toHaveBeenCalledWith({
        where: { category: "Development" },
        data: { category: "Software" },
      });
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(prisma.auditLog.create).toHaveBeenCalled();
      expect(revalidateTag).toHaveBeenCalled();
    });
  });

  describe("deleteCareerOptionAction", () => {
    it("should reject unauthorized user", async () => {
      (getSessionAdmin as any).mockResolvedValue(null);

      const res = await deleteCareerOptionAction("opt-1");
      expect(res.success).toBe(false);
      expect(res.error).toBe("Unauthorized access");
    });

    it("should reject an unknown option id", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any).mockResolvedValue(null);

      const res = await deleteCareerOptionAction("nope");
      expect(res.success).toBe(false);
      expect(res.error).toBe("Option not found.");
    });

    it("should block deleting the last option of a kind", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any).mockResolvedValue(existingOption);
      (prisma.careerOption.count as any).mockResolvedValue(1);

      const res = await deleteCareerOptionAction("opt-1");
      expect(res.success).toBe(false);
      expect(res.error).toBe("At least one category is required.");
      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(prisma.careerOption.delete).not.toHaveBeenCalled();
    });

    it("should block deleting an option that is in use", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any).mockResolvedValue(existingOption);
      (prisma.careerOption.count as any).mockResolvedValue(7);
      (prisma.$transaction as any).mockImplementation(async (fn: any) =>
        fn({
          career: { count: vi.fn().mockResolvedValue(2) },
          careerOption: { delete: vi.fn() },
        })
      );

      const res = await deleteCareerOptionAction("opt-1");
      expect(res.success).toBe(false);
      expect(res.error).toContain("2 position(s) currently use it");
      expect(prisma.careerOption.delete).not.toHaveBeenCalled();
    });

    it("should delete an unused option when authenticated", async () => {
      (getSessionAdmin as any).mockResolvedValue({ email: "admin@mimos.my" });
      (prisma.careerOption.findUnique as any).mockResolvedValue(existingOption);
      (prisma.careerOption.count as any).mockResolvedValue(7);
      (prisma.$transaction as any).mockImplementation(async (fn: any) =>
        fn({
          career: { count: vi.fn().mockResolvedValue(0) },
          careerOption: { delete: prisma.careerOption.delete },
        })
      );
      (prisma.careerOption.delete as any).mockResolvedValue(existingOption);

      const res = await deleteCareerOptionAction("opt-1");
      expect(res.success).toBe(true);
      expect(prisma.$transaction).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ isolationLevel: "Serializable" })
      );
      expect(prisma.careerOption.delete).toHaveBeenCalledWith({ where: { id: "opt-1" } });
      expect(prisma.auditLog.create).toHaveBeenCalled();
      expect(revalidateTag).toHaveBeenCalled();
    });
  });
});
