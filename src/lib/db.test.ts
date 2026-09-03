/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";

// The db module's lazy prisma proxy constructs a real PrismaClient/Pool on
// first model access — replace those with in-memory mocks so we can exercise
// the getters' empty/error behavior without a database.
const modelMocks = vi.hoisted(() => ({
  category: { findMany: vi.fn() },
  program: { findMany: vi.fn(), findUnique: vi.fn() },
  stat: { findMany: vi.fn() },
  partner: { findMany: vi.fn() },
  whyChooseUsCard: { findMany: vi.fn() },
  testimonial: { findMany: vi.fn() },
  aboutSettings: { findFirst: vi.fn() },
  teamMember: { findMany: vi.fn() },
  newsArticle: { findMany: vi.fn(), findUnique: vi.fn() },
  facility: { findMany: vi.fn() },
  event: { findMany: vi.fn() },
  career: { findMany: vi.fn() },
  careerOption: { findMany: vi.fn() },
}));

vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => unknown) => fn,
}));

vi.mock("pg", () => ({
  Pool: class {},
}));

vi.mock("@prisma/adapter-pg", () => ({
  PrismaPg: class {},
}));

vi.mock("@prisma/client", () => ({
  PrismaClient: class {
    constructor() {
      Object.assign(this, modelMocks);
    }
  },
}));

import { prisma } from "@/lib/db";
import {
  getSafeCategories,
  getSafePrograms,
  getSafeProgramBySlug,
  getSafeStats,
  getSafePartners,
  getSafeWhyChooseUsCards,
  getSafeTestimonials,
  getSafeAboutSettings,
  getSafeTeamMembers,
  getSafeNewsArticles,
  getSafeHighlightedNews,
  getSafeNewsArticleById,
  getSafeFacilities,
  getSafeUpcomingEvents,
  getSafeEventById,
  getSafeCareers,
} from "@/lib/db";

const dbError = () => new Error("DB down");

describe("getters return only DB data (no mock fallback)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getSafeCategories returns [] when table is empty and on error", async () => {
    vi.mocked(prisma.category.findMany).mockResolvedValue([] as any);
    expect(await getSafeCategories()).toEqual([]);

    vi.mocked(prisma.category.findMany).mockRejectedValue(dbError());
    expect(await getSafeCategories()).toBeNull();
  });

  it("getSafePrograms returns [] when table is empty and on error", async () => {
    vi.mocked(prisma.program.findMany).mockResolvedValue([] as any);
    expect(await getSafePrograms()).toEqual([]);

    vi.mocked(prisma.program.findMany).mockRejectedValue(dbError());
    expect(await getSafePrograms()).toBeNull();
  });

  it("getSafeProgramBySlug returns DB row, null when missing, null on error", async () => {
    const row = { id: "p1", slug: "test-program" } as any;
    vi.mocked(prisma.program.findUnique).mockResolvedValue(row);
    expect(await getSafeProgramBySlug("test-program")).toEqual(row);

    vi.mocked(prisma.program.findUnique).mockResolvedValue(null);
    expect(await getSafeProgramBySlug("missing")).toBeNull();

    vi.mocked(prisma.program.findUnique).mockRejectedValue(dbError());
    expect(await getSafeProgramBySlug("test-program")).toBeNull();
  });

  it("getSafeStats returns [] when table is empty and on error", async () => {
    vi.mocked(prisma.stat.findMany).mockResolvedValue([] as any);
    expect(await getSafeStats()).toEqual([]);

    vi.mocked(prisma.stat.findMany).mockRejectedValue(dbError());
    expect(await getSafeStats()).toBeNull();
  });

  it("getSafePartners returns [] when table is empty and on error", async () => {
    vi.mocked(prisma.partner.findMany).mockResolvedValue([] as any);
    expect(await getSafePartners()).toEqual([]);

    vi.mocked(prisma.partner.findMany).mockRejectedValue(dbError());
    expect(await getSafePartners()).toBeNull();
  });

  it("getSafeWhyChooseUsCards returns [] when table is empty and on error", async () => {
    vi.mocked(prisma.whyChooseUsCard.findMany).mockResolvedValue([] as any);
    expect(await getSafeWhyChooseUsCards()).toEqual([]);

    vi.mocked(prisma.whyChooseUsCard.findMany).mockRejectedValue(dbError());
    expect(await getSafeWhyChooseUsCards()).toBeNull();
  });

  it("getSafeTestimonials returns [] when table is empty and on error", async () => {
    vi.mocked(prisma.testimonial.findMany).mockResolvedValue([] as any);
    expect(await getSafeTestimonials()).toEqual([]);

    vi.mocked(prisma.testimonial.findMany).mockRejectedValue(dbError());
    expect(await getSafeTestimonials()).toBeNull();
  });

  it("getSafeAboutSettings returns DB settings, empty settings when missing/error", async () => {
    const settings = { id: "s1", mission: "M", vision: "V" } as any;
    vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(settings);
    expect(await getSafeAboutSettings()).toEqual(settings);

    vi.mocked(prisma.aboutSettings.findFirst).mockResolvedValue(null);
    expect(await getSafeAboutSettings()).toEqual({ mission: "", vision: "" });

    vi.mocked(prisma.aboutSettings.findFirst).mockRejectedValue(dbError());
    expect(await getSafeAboutSettings()).toBeNull();
  });

  it("getSafeTeamMembers returns [] when table is empty and on error", async () => {
    vi.mocked(prisma.teamMember.findMany).mockResolvedValue([] as any);
    expect(await getSafeTeamMembers()).toEqual([]);
    expect(prisma.teamMember.findMany).toHaveBeenCalledWith({
      orderBy: [{ level: "asc" }, { order: "asc" }],
    });

    vi.mocked(prisma.teamMember.findMany).mockRejectedValue(dbError());
    expect(await getSafeTeamMembers()).toBeNull();
  });

  it("getSafeNewsArticles returns [] when table is empty and on error", async () => {
    vi.mocked(prisma.newsArticle.findMany).mockResolvedValue([] as any);
    expect(await getSafeNewsArticles()).toEqual([]);

    vi.mocked(prisma.newsArticle.findMany).mockRejectedValue(dbError());
    expect(await getSafeNewsArticles()).toBeNull();
  });

  it("getSafeHighlightedNews returns [] when no highlights and on error", async () => {
    vi.mocked(prisma.newsArticle.findMany).mockResolvedValue([] as any);
    expect(await getSafeHighlightedNews()).toEqual([]);

    vi.mocked(prisma.newsArticle.findMany).mockRejectedValue(dbError());
    expect(await getSafeHighlightedNews()).toBeNull();
  });

  it("getSafeNewsArticleById returns DB row, null when missing, null on error", async () => {
    const row = { id: "n1", title: "News" } as any;
    vi.mocked(prisma.newsArticle.findUnique).mockResolvedValue(row);
    expect(await getSafeNewsArticleById("n1")).toEqual(row);

    vi.mocked(prisma.newsArticle.findUnique).mockResolvedValue(null);
    expect(await getSafeNewsArticleById("missing")).toBeNull();

    vi.mocked(prisma.newsArticle.findUnique).mockRejectedValue(dbError());
    expect(await getSafeNewsArticleById("n1")).toBeNull();
  });

  it("getSafeFacilities returns [] when table is empty and on error", async () => {
    vi.mocked(prisma.facility.findMany).mockResolvedValue([] as any);
    expect(await getSafeFacilities()).toEqual([]);

    vi.mocked(prisma.facility.findMany).mockRejectedValue(dbError());
    expect(await getSafeFacilities()).toBeNull();
  });

  it("getSafeUpcomingEvents returns rows, [] when empty, [] on error", async () => {
    const rows = [{ id: "e1", title: "Event", date: "JAN 01", category: "SEMINAR" }] as any;
    vi.mocked(prisma.event.findMany).mockResolvedValue(rows);
    expect(await getSafeUpcomingEvents()).toHaveLength(1);

    vi.mocked(prisma.event.findMany).mockResolvedValue([]);
    expect(await getSafeUpcomingEvents()).toEqual([]);

    vi.mocked(prisma.event.findMany).mockRejectedValue(dbError());
    expect(await getSafeUpcomingEvents()).toBeNull();
  });

  it("getSafeEventById returns matching event, null when missing, null on error", async () => {
    const rows = [{ id: "e1", title: "Event", date: "JAN 01", category: "SEMINAR" }] as any;
    vi.mocked(prisma.event.findMany).mockResolvedValue(rows);
    expect((await getSafeEventById("e1"))?.id).toBe("e1");
    expect(await getSafeEventById("nope")).toBeNull();

    vi.mocked(prisma.event.findMany).mockRejectedValue(dbError());
    expect(await getSafeEventById("e1")).toBeNull();
  });

  it("getSafeCareers returns rows, [] when empty, [] on error", async () => {
    const rows = [{ id: "job-1", title: "Engineer" }] as any;
    vi.mocked(prisma.career.findMany).mockResolvedValue(rows);
    expect(await getSafeCareers()).toHaveLength(1);

    vi.mocked(prisma.career.findMany).mockResolvedValue([]);
    expect(await getSafeCareers()).toEqual([]);

    vi.mocked(prisma.career.findMany).mockRejectedValue(dbError());
    expect(await getSafeCareers()).toBeNull();
  });
});
