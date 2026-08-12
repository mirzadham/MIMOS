/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createNewsArticleAction,
  updateNewsArticleAction,
  deleteNewsArticleAction,
  createFacilityAction,
  updateFacilityAction,
  deleteFacilityAction,
  saveUpcomingEventAction,
  deleteUpcomingEventAction,
} from "./adminActions";
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
    newsArticle: {
      count: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    facility: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    event: {
      upsert: vi.fn(),
      delete: vi.fn(),
    },
    auditLog: {
      create: vi.fn(),
    },
  };
  return {
    prisma: mockPrisma,
    mockNewsArticles: [
      { id: "mock-1", title: "Article 1", isHighlighted: true },
      { id: "mock-2", title: "Article 2", isHighlighted: true },
      { id: "mock-3", title: "Article 3", isHighlighted: true },
      { id: "mock-4", title: "Article 4", isHighlighted: true },
    ],
    setMockNewsArticles: vi.fn(),
    mockFacilities: [
      { id: "mock-fac-1", title: "Facility 1", specs: [] },
    ],
    setMockFacilities: vi.fn(),
    mockUpcomingEvents: [
      { id: "mock-evt-1", title: "Mock Event 1", category: "SEMINAR", date: "JAN 01" },
    ],
    sanitizeEventAgenda: (v: unknown) => Array.isArray(v) ? v : [],
  };
});

describe("Admin News Server Actions Tests", () => {
  const mockAdmin = { email: "admin@mimos.my", role: "ADMIN" };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("createNewsArticleAction", () => {
    it("should throw an error if the user is unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(
        createNewsArticleAction({
          title: "New Title",
          category: "Administration",
          date: "10 June 2026",
          description: "Desc",
          content: "Content",
          imageUrl: null,
          isHighlighted: false,
          order: 0
        })
      ).rejects.toThrow("Unauthorized");
    });

    it("should create article in DB if authorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      const articleData = {
        title: "New Title",
        category: "Administration",
        date: "10 June 2026",
        description: "Desc",
        content: "Content",
        imageUrl: null,
        isHighlighted: false,
        order: 0
      };
      
      const createdArticle = { id: "new-article-id", ...articleData };
      vi.mocked(prisma.newsArticle.create).mockResolvedValue(createdArticle as any);

      const res = await createNewsArticleAction(articleData);
      
      expect(res.success).toBe(true);
      expect(res.article?.title).toBe("New Title");
      expect(prisma.newsArticle.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: "New Title",
            content: "Content"
          })
        })
      );
    });

    it("should fail if trying to highlight when already 4 highlighted", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      vi.mocked(prisma.newsArticle.count).mockResolvedValue(4);

      const res = await createNewsArticleAction({
        title: "New Title",
        category: "Administration",
        date: "10 June 2026",
        description: "Desc",
        content: "Content",
        imageUrl: null,
        isHighlighted: true,
        order: 0
      });

      expect(res.success).toBe(false);
      expect(res.error).toContain("Maximum 4 highlighted");
    });
  });

  describe("updateNewsArticleAction", () => {
    it("should throw an error if unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(
        updateNewsArticleAction("mock-1", {
          title: "Updated Title",
          category: "Administration",
          date: "10 June 2026",
          description: "Desc",
          content: "Content",
          imageUrl: null,
          isHighlighted: false,
          order: 0
        })
      ).rejects.toThrow("Unauthorized");
    });

    it("should update article in DB if authorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      const articleData = {
        title: "Updated Title",
        category: "Administration",
        date: "10 June 2026",
        description: "Desc",
        content: "Content",
        imageUrl: null,
        isHighlighted: false,
        order: 0
      };
      
      const updatedArticle = { id: "mock-1", ...articleData };
      vi.mocked(prisma.newsArticle.update).mockResolvedValue(updatedArticle as any);

      const res = await updateNewsArticleAction("mock-1", articleData);
      
      expect(res.success).toBe(true);
      expect(prisma.newsArticle.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "mock-1" },
          data: expect.objectContaining({
            title: "Updated Title",
            content: "Content"
          })
        })
      );
    });
  });

  describe("deleteNewsArticleAction", () => {
    it("should throw an error if unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(deleteNewsArticleAction("mock-1")).rejects.toThrow("Unauthorized");
    });

    it("should delete article from DB if authorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      const deletedArticle = { id: "mock-1", title: "Deleted News" };
      vi.mocked(prisma.newsArticle.delete).mockResolvedValue(deletedArticle as any);

      const res = await deleteNewsArticleAction("mock-1");

      expect(res.success).toBe(true);
      expect(prisma.newsArticle.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "mock-1" }
        })
      );
    });
  });

  describe("createFacilityAction", () => {
    it("should throw an error if unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(
        createFacilityAction({
          index: "01",
          title: "STC",
          subtitle: "Wafer",
          imageUrl: null,
          desc: "Desc",
          specs: [],
          order: 0
        })
      ).rejects.toThrow("Unauthorized");
    });

    it("should create facility in DB if authorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      const facilityData = {
        index: "01",
        title: "STC",
        subtitle: "Wafer",
        imageUrl: null,
        desc: "Desc",
        specs: ["Spec 1: Val"],
        order: 0
      };

      const createdFacility = { id: "new-fac-id", ...facilityData };
      vi.mocked(prisma.facility.create).mockResolvedValue(createdFacility as any);

      const res = await createFacilityAction(facilityData);

      expect(res.success).toBe(true);
      expect(res.facility?.title).toBe("STC");
      expect(prisma.facility.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: "STC",
            specs: expect.arrayContaining(["Spec 1: Val"])
          })
        })
      );
    });
  });

  describe("updateFacilityAction", () => {
    it("should throw an error if unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(
        updateFacilityAction("mock-fac-1", {
          index: "01",
          title: "STC",
          subtitle: "Wafer",
          imageUrl: null,
          desc: "Desc",
          specs: [],
          order: 0
        })
      ).rejects.toThrow("Unauthorized");
    });

    it("should update facility in DB if authorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      const facilityData = {
        index: "01",
        title: "STC Updated",
        subtitle: "Wafer",
        imageUrl: null,
        desc: "Desc",
        specs: [],
        order: 0
      };

      const updatedFacility = { id: "mock-fac-1", ...facilityData };
      vi.mocked(prisma.facility.update).mockResolvedValue(updatedFacility as any);

      const res = await updateFacilityAction("mock-fac-1", facilityData);

      expect(res.success).toBe(true);
      expect(prisma.facility.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "mock-fac-1" },
          data: expect.objectContaining({
            title: "STC Updated"
          })
        })
      );
    });
  });

  describe("deleteFacilityAction", () => {
    it("should throw an error if unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(deleteFacilityAction("mock-fac-1")).rejects.toThrow("Unauthorized");
    });

    it("should delete facility from DB if authorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      const deletedFacility = { id: "mock-fac-1", title: "Deleted" };
      vi.mocked(prisma.facility.delete).mockResolvedValue(deletedFacility as any);

      const res = await deleteFacilityAction("mock-fac-1");

      expect(res.success).toBe(true);
      expect(prisma.facility.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "mock-fac-1" }
        })
      );
    });
  });

  describe("saveUpcomingEventAction", () => {
    it("should throw an error if unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(
        saveUpcomingEventAction({ title: "New Event" })
      ).rejects.toThrow("Unauthorized");
    });

    it("should upsert event in DB if authorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      const eventData = {
        id: "evt-123",
        title: "New Event",
        category: "WORKSHOP" as const,
        date: "JAN 10",
        rawDate: "2027-01-10",
        agenda: [{ time: "09:00 AM", topic: "Intro" }],
      };
      vi.mocked(prisma.event.upsert).mockResolvedValue({ ...eventData } as any);

      const res = await saveUpcomingEventAction(eventData as any);

      expect(res.success).toBe(true);
      expect("event" in res ? res.event.title : null).toBe("New Event");
      expect(prisma.event.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "evt-123" },
          create: expect.objectContaining({
            title: "New Event",
            category: "WORKSHOP",
            agenda: [{ time: "09:00 AM", topic: "Intro" }],
          })
        })
      );
    });

    it("should return an error when DB save fails (no mock fallback)", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      vi.mocked(prisma.event.upsert).mockRejectedValue(new Error("DB down"));

      const res = await saveUpcomingEventAction({ title: "Fallback Event" });

      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("should return an error in production when DB save fails (no mock fallback)", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      vi.mocked(prisma.event.upsert).mockRejectedValue(new Error("DB down"));
      vi.stubEnv("NODE_ENV", "production");

      const res = await saveUpcomingEventAction({ title: "Prod Event" });

      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });
  });

  describe("deleteUpcomingEventAction", () => {
    it("should throw an error if unauthorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(null);
      await expect(deleteUpcomingEventAction("evt-123")).rejects.toThrow("Unauthorized");
    });

    it("should delete event from DB if authorized", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      vi.mocked(prisma.event.delete).mockResolvedValue({ id: "evt-123" } as any);

      const res = await deleteUpcomingEventAction("evt-123");

      expect(res.success).toBe(true);
      expect(prisma.event.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "evt-123" }
        })
      );
    });

    it("should return an error when DB delete fails (no mock fallback)", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      vi.mocked(prisma.event.delete).mockRejectedValue(new Error("DB down"));

      const res = await deleteUpcomingEventAction("mock-evt-1");

      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("should return an error in production when DB delete fails (no mock fallback)", async () => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
      vi.mocked(prisma.event.delete).mockRejectedValue(new Error("DB down"));
      vi.stubEnv("NODE_ENV", "production");

      const res = await deleteUpcomingEventAction("evt-123");

      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });
  });
});
