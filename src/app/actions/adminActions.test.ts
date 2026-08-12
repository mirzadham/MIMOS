/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  createProgramAction,
  updateProgramAction,
  deleteProgramAction,
  createCategoryAction,
  createStatAction,
  updateStatAction,
  deleteStatAction,
  createPartnerAction,
  updatePartnerAction,
  deletePartnerAction,
  createWhyChooseUsCardAction,
  updateWhyChooseUsCardAction,
  deleteWhyChooseUsCardAction,
  createTestimonialAction,
  updateTestimonialAction,
  deleteTestimonialAction,
  createNewsArticleAction,
  updateNewsArticleAction,
  deleteNewsArticleAction,
  toggleNewsHighlightAction,
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
    program: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    category: {
      create: vi.fn(),
    },
    stat: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    partner: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    whyChooseUsCard: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    testimonial: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
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
          order: 0,
          featured: false
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
        order: 0,
        featured: true
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
            specs: expect.arrayContaining(["Spec 1: Val"]),
            featured: true
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
          order: 0,
          featured: false
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
        order: 0,
        featured: true
      };

      const updatedFacility = { id: "mock-fac-1", ...facilityData };
      vi.mocked(prisma.facility.update).mockResolvedValue(updatedFacility as any);

      const res = await updateFacilityAction("mock-fac-1", facilityData);

      expect(res.success).toBe(true);
      expect(prisma.facility.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "mock-fac-1" },
          data: expect.objectContaining({
            title: "STC Updated",
            featured: true
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

  describe("DB failure returns error (no mock fallback)", () => {
    const programData = {
      title: "Program",
      description: "Desc",
      syllabus: "Syllabus",
      location: "KL",
      price: "RM100",
      duration: "3 days",
      dates: "JAN",
      microsoftFormUrl: "https://example.com",
      categoryId: "cat-1",
    };
    const cardData = { title: "Card", description: "Desc", imageUrl: null, colspan: 1, order: 0 };
    const testimonialData = { quote: "Q", name: "N", role: "R", company: "C", order: 0 };

    beforeEach(() => {
      vi.mocked(getSessionAdmin).mockResolvedValue(mockAdmin);
    });

    it("createProgramAction", async () => {
      vi.mocked(prisma.program.create).mockRejectedValue(new Error("DB down"));
      const res = await createProgramAction(programData);
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("updateProgramAction", async () => {
      vi.mocked(prisma.program.update).mockRejectedValue(new Error("DB down"));
      const res = await updateProgramAction("prog-1", programData);
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("deleteProgramAction", async () => {
      vi.mocked(prisma.program.delete).mockRejectedValue(new Error("DB down"));
      const res = await deleteProgramAction("prog-1");
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("createCategoryAction", async () => {
      vi.mocked(prisma.category.create).mockRejectedValue(new Error("DB down"));
      const res = await createCategoryAction("New Category");
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("createStatAction", async () => {
      vi.mocked(prisma.stat.create).mockRejectedValue(new Error("DB down"));
      const res = await createStatAction({ number: "100", label: "Students" });
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("updateStatAction", async () => {
      vi.mocked(prisma.stat.update).mockRejectedValue(new Error("DB down"));
      const res = await updateStatAction("stat-1", { number: "100", label: "Students" });
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("deleteStatAction", async () => {
      vi.mocked(prisma.stat.delete).mockRejectedValue(new Error("DB down"));
      const res = await deleteStatAction("stat-1");
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("createPartnerAction", async () => {
      vi.mocked(prisma.partner.create).mockRejectedValue(new Error("DB down"));
      const res = await createPartnerAction({ name: "Partner", logoUrl: "/logo.svg" });
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("updatePartnerAction", async () => {
      vi.mocked(prisma.partner.update).mockRejectedValue(new Error("DB down"));
      const res = await updatePartnerAction("partner-1", { name: "Partner", logoUrl: "/logo.svg" });
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("deletePartnerAction", async () => {
      vi.mocked(prisma.partner.delete).mockRejectedValue(new Error("DB down"));
      const res = await deletePartnerAction("partner-1");
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("createWhyChooseUsCardAction", async () => {
      vi.mocked(prisma.whyChooseUsCard.create).mockRejectedValue(new Error("DB down"));
      const res = await createWhyChooseUsCardAction(cardData);
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("updateWhyChooseUsCardAction", async () => {
      vi.mocked(prisma.whyChooseUsCard.update).mockRejectedValue(new Error("DB down"));
      const res = await updateWhyChooseUsCardAction("card-1", cardData);
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("deleteWhyChooseUsCardAction", async () => {
      vi.mocked(prisma.whyChooseUsCard.delete).mockRejectedValue(new Error("DB down"));
      const res = await deleteWhyChooseUsCardAction("card-1");
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("createTestimonialAction", async () => {
      vi.mocked(prisma.testimonial.create).mockRejectedValue(new Error("DB down"));
      const res = await createTestimonialAction(testimonialData);
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("updateTestimonialAction", async () => {
      vi.mocked(prisma.testimonial.update).mockRejectedValue(new Error("DB down"));
      const res = await updateTestimonialAction("t-1", testimonialData);
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("deleteTestimonialAction", async () => {
      vi.mocked(prisma.testimonial.delete).mockRejectedValue(new Error("DB down"));
      const res = await deleteTestimonialAction("t-1");
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("createNewsArticleAction", async () => {
      vi.mocked(prisma.newsArticle.create).mockRejectedValue(new Error("DB down"));
      const res = await createNewsArticleAction({
        title: "T", category: "Administration", date: "JAN 01",
        description: "D", content: "C", imageUrl: null, isHighlighted: false, order: 0
      });
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("updateNewsArticleAction", async () => {
      vi.mocked(prisma.newsArticle.update).mockRejectedValue(new Error("DB down"));
      const res = await updateNewsArticleAction("news-1", {
        title: "T", category: "Administration", date: "JAN 01",
        description: "D", content: "C", imageUrl: null, isHighlighted: false, order: 0
      });
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("deleteNewsArticleAction", async () => {
      vi.mocked(prisma.newsArticle.delete).mockRejectedValue(new Error("DB down"));
      const res = await deleteNewsArticleAction("news-1");
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("toggleNewsHighlightAction", async () => {
      vi.mocked(prisma.newsArticle.count).mockResolvedValue(0);
      vi.mocked(prisma.newsArticle.update).mockRejectedValue(new Error("DB down"));
      const res = await toggleNewsHighlightAction("news-1", true);
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("news actions return error when highlight count check fails", async () => {
      vi.mocked(prisma.newsArticle.count).mockRejectedValue(new Error("DB down"));
      const res = await createNewsArticleAction({
        title: "T", category: "Administration", date: "JAN 01",
        description: "D", content: "C", imageUrl: null, isHighlighted: true, order: 0
      });
      expect(res.success).toBe(false);
      expect(res.error).toContain("highlighted article count");
    });

    it("createFacilityAction", async () => {
      vi.mocked(prisma.facility.create).mockRejectedValue(new Error("DB down"));
      const res = await createFacilityAction({ index: "01", title: "F", subtitle: "S", imageUrl: null, desc: "D", specs: [], order: 0, featured: false });
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("updateFacilityAction", async () => {
      vi.mocked(prisma.facility.update).mockRejectedValue(new Error("DB down"));
      const res = await updateFacilityAction("fac-1", { index: "01", title: "F", subtitle: "S", imageUrl: null, desc: "D", specs: [], order: 0, featured: false });
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });

    it("deleteFacilityAction", async () => {
      vi.mocked(prisma.facility.delete).mockRejectedValue(new Error("DB down"));
      const res = await deleteFacilityAction("fac-1");
      expect(res.success).toBe(false);
      expect("error" in res && res.error).toBeTruthy();
    });
  });
});
