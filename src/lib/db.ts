import { PrismaClient } from '@prisma/client';
import type { Event as PrismaEvent } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { unstable_cache } from 'next/cache';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_EMPLOYMENT_TYPES,
  DEFAULT_LOCATION_MODES,
} from '@/data/careersData';

let prismaInstance: PrismaClient | null = null;

// Lazy-loaded Prisma Client proxy to bypass Next.js build-time collection instantiation checks
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!prismaInstance) {
      const connectionString = process.env.DATABASE_URL;
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      prismaInstance = new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
    }
    return Reflect.get(prismaInstance, prop);
  }
});

export async function getSafeCategories() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.category.findMany({
          orderBy: { name: 'asc' }
        });
      } catch (e) {
        console.error("Prisma Category Fetch failed: ", e);
        return null;
      }
    },
    ["categories"],
    { tags: ["cms-content"] }
  )();
}

export async function getSafePrograms(categoryId?: string) {
  return unstable_cache(
    async () => {
      try {
        return await prisma.program.findMany({
          where: categoryId ? { categoryId } : undefined,
          include: { category: true },
          orderBy: { title: 'asc' }
        });
      } catch (e) {
        console.error("Prisma Program Fetch failed: ", e);
        return null;
      }
    },
    ["programs", categoryId || "all"],
    { tags: ["cms-content"] }
  )();
}

export async function getSafeProgramBySlug(slug: string) {
  return unstable_cache(
    async () => {
      try {
        return await prisma.program.findUnique({
          where: { slug },
          include: { category: true }
        });
      } catch (e) {
        console.error(`Prisma Program Fetch for slug ${slug} failed: `, e);
        return null;
      }
    },
    ["program", slug],
    { tags: ["cms-content"] }
  )();
}

export async function getSafeStats() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.stat.findMany({
          orderBy: { createdAt: 'asc' }
        });
      } catch (e) {
        console.error("Prisma Stat Fetch failed: ", e);
        return null;
      }
    },
    ["stats"],
    { tags: ["cms-content"] }
  )();
}

export async function getSafePartners() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.partner.findMany({
          orderBy: { createdAt: 'asc' }
        });
      } catch (e) {
        console.error("Prisma Partner Fetch failed: ", e);
        return null;
      }
    },
    ["partners"],
    { tags: ["cms-content"] }
  )();
}

export async function getSafeWhyChooseUsCards() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.whyChooseUsCard.findMany({
          orderBy: { order: 'asc' }
        });
      } catch (e) {
        console.error("Prisma WhyChooseUsCard Fetch failed: ", e);
        return null;
      }
    },
    ["whyChooseUsCards"],
    { tags: ["cms-content"] }
  )();
}

export async function getSafeTestimonials() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.testimonial.findMany({
          orderBy: { order: 'asc' }
        });
      } catch (e) {
        console.error("Prisma Testimonial Fetch failed: ", e);
        return null;
      }
    },
    ["testimonials"],
    { tags: ["cms-content"] }
  )();
}

export interface AboutSettingsView {
  mission: string;
  vision: string;
}

export async function getSafeAboutSettings(): Promise<AboutSettingsView | null> {
  return unstable_cache(
    async () => {
      try {
        const settings = await prisma.aboutSettings.findFirst();
        return settings || { mission: "", vision: "" };
      } catch (e) {
        console.error("Prisma AboutSettings Fetch failed: ", e);
        return null;
      }
    },
    ["aboutSettings"],
    { tags: ["cms-content"] }
  )();
}

export async function getSafeTeamMembers() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.teamMember.findMany({
          orderBy: { order: 'asc' }
        });
      } catch (e) {
        console.error("Prisma TeamMember Fetch failed: ", e);
        return null;
      }
    },
    ["teamMembers"],
    { tags: ["cms-content"] }
  )();
}

export async function getSafeNewsArticles() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.newsArticle.findMany({
          orderBy: { order: 'asc' }
        });
      } catch (e) {
        console.error("Prisma NewsArticle Fetch failed: ", e);
        return null;
      }
    },
    ["newsArticles"],
    { tags: ["cms-content"] }
  )();
}

export async function getSafeHighlightedNews() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.newsArticle.findMany({
          where: { isHighlighted: true },
          orderBy: { order: 'asc' }
        });
      } catch (e) {
        console.error("Prisma Highlighted News Fetch failed: ", e);
        return null;
      }
    },
    ["highlightedNews"],
    { tags: ["cms-content"] }
  )();
}

export async function getSafeNewsArticleById(id: string) {
  return unstable_cache(
    async () => {
      try {
        return await prisma.newsArticle.findUnique({
          where: { id }
        });
      } catch (e) {
        console.error("Prisma NewsArticle findUnique failed: ", e);
        return null;
      }
    },
    ["newsArticle", id],
    { tags: ["cms-content"] }
  )();
}

export async function getSafeFacilities() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.facility.findMany({
          orderBy: { order: 'asc' }
        });
      } catch (e) {
        console.error("Prisma Facility Fetch failed: ", e);
        return null;
      }
    },
    ["facilities"],
    { tags: ["cms-content"] }
  )();
}

export interface UpcomingEvent {
  id: string;
  date: string;
  rawDate?: string;
  title: string;
  category: "LAB VISIT" | "TRAINING" | "SEMINAR" | "WORKSHOP";
  isPast?: boolean;
  location?: string;
  description?: string;
  imageUrl?: string;
  microsoftFormUrl?: string;
  agenda?: { time: string; topic: string }[];
  link?: string;
}

export const EVENT_CATEGORIES = ["LAB VISIT", "TRAINING", "SEMINAR", "WORKSHOP"] as const;

// Runtime guards for values crossing the DB boundary (defense-in-depth against
// invalid data written outside the admin UI's constrained select).
export function sanitizeEventCategory(value: string | null | undefined): UpcomingEvent["category"] {
  return EVENT_CATEGORIES.includes(value as UpcomingEvent["category"])
    ? (value as UpcomingEvent["category"])
    : "SEMINAR";
}

export function sanitizeEventAgenda(value: unknown): { time: string; topic: string }[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is { time: string; topic: string } =>
      typeof item === "object" &&
      item !== null &&
      typeof (item as { time?: unknown }).time === "string" &&
      typeof (item as { topic?: unknown }).topic === "string"
  );
}

// Fetches events from the DB. Returns [] when the table is empty (so an empty
// production site shows no events until admins create them) and null when the
// DB is unavailable (callers render an unavailable notice in that case).
// The Prisma client is injectable for testing.
export async function fetchEventsFromDb(
  client: Pick<PrismaClient, "event"> = prisma
): Promise<UpcomingEvent[] | null> {
  try {
    const events = await client.event.findMany({
      orderBy: [{ isPast: 'asc' }, { rawDate: 'asc' }],
    });
    return events.map(dbEventToUpcomingEvent);
  } catch (e) {
    console.error("Prisma Event Fetch failed: ", e);
    return null;
  }
}

export async function getSafeUpcomingEvents() {
  return unstable_cache(
    async () => {
      const events = await fetchEventsFromDb();
      if (events !== null) return events; // rows, or [] when the table is empty
      // DB unavailable — null signals callers to show an unavailable state.
      return null;
    },
    ["upcomingEvents"],
    { tags: ["cms-content"] }
  )();
}

export function dbEventToUpcomingEvent(e: PrismaEvent): UpcomingEvent {
  return {
    id: e.id,
    date: e.date,
    rawDate: e.rawDate ?? undefined,
    title: e.title,
    category: sanitizeEventCategory(e.category),
    isPast: e.isPast,
    location: e.location ?? undefined,
    description: e.description ?? undefined,
    imageUrl: e.imageUrl ?? undefined,
    microsoftFormUrl: e.microsoftFormUrl ?? undefined,
    agenda: sanitizeEventAgenda(e.agenda),
    link: e.link ?? undefined,
  };
}

export async function getSafeEventById(id: string) {
  const events = await getSafeUpcomingEvents();
  return events?.find((e) => e.id === id) || null;
}

export async function getSafeCareers() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.career.findMany({
          orderBy: { order: "asc" },
        });
      } catch (e) {
        console.error("Careers Fetch failed: ", e);
        return null;
      }
    },
    ["careers"],
    { tags: ["cms-content"] }
  )();
}

// ---------------------------------------------------------------------------
// Career options (categories / employment types / location modes)
// ---------------------------------------------------------------------------

export type CareerOptionKind = "CATEGORY" | "EMPLOYMENT_TYPE" | "LOCATION_MODE";

export interface CareerOptionItem {
  id: string;
  kind: CareerOptionKind;
  name: string;
  order: number;
}

/** Default option rows used when the database is unreachable (mirrors migration seeds). */
export const DEFAULT_CAREER_OPTIONS: CareerOptionItem[] = [
  ...DEFAULT_CATEGORIES.map((name, order) => ({
    id: `default-cat-${order}`,
    kind: "CATEGORY" as const,
    name,
    order,
  })),
  ...DEFAULT_EMPLOYMENT_TYPES.map((name, order) => ({
    id: `default-et-${order}`,
    kind: "EMPLOYMENT_TYPE" as const,
    name,
    order,
  })),
  ...DEFAULT_LOCATION_MODES.map((name, order) => ({
    id: `default-lm-${order}`,
    kind: "LOCATION_MODE" as const,
    name,
    order,
  })),
];

/**
 * Fetch the managed career option lists (categories, employment types,
 * location modes), ordered by kind + order. Falls back to the default
 * option lists when the database is unreachable OR the table is empty
 * (e.g. a database that predates the career_options migration), so admin
 * forms and public filters always have a usable option set.
 */
export function getSafeCareerOptions(kind?: CareerOptionKind) {
  const fallback = kind
    ? DEFAULT_CAREER_OPTIONS.filter((o) => o.kind === kind)
    : DEFAULT_CAREER_OPTIONS;
  return unstable_cache(
    async () => {
      try {
        const options = await prisma.careerOption.findMany({
          where: kind ? { kind } : undefined,
          orderBy: [{ kind: "asc" }, { order: "asc" }],
        });
        if (options.length === 0) return fallback;
        return options;
      } catch (e) {
        console.warn("Career options fetch failed, falling back to defaults: ", e);
        return fallback;
      }
    },
    kind ? [`career-options-${kind.toLowerCase()}`] : ["career-options"],
    { tags: ["cms-content"] }
  )();
}






