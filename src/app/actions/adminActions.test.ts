/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  createNewsArticleAction, 
  updateNewsArticleAction,
  deleteNewsArticleAction,
} from "./adminActions";
import { getSessionAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
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
  };
});

describe("Admin News Server Actions Tests", () => {
  const mockAdmin = { email: "admin@mimos.my", role: "ADMIN" };

  beforeEach(() => {
    vi.resetAllMocks();
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
});
