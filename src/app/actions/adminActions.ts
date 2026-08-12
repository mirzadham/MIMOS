"use server";

import { revalidatePath as nextRevalidatePath, revalidateTag } from "next/cache";

function revalidatePath(path: string) {
  nextRevalidatePath(path, "layout");
  (revalidateTag as unknown as (tag: string) => void)("cms-content");
}
import { loginAdmin, logoutAdmin, getSessionAdmin } from "@/lib/adminAuth";
import { prisma, sanitizeEventAgenda, UpcomingEvent } from "@/lib/db";
import { headers } from "next/headers";

async function getClientIp(): Promise<string> {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0].trim();
    }
    const realIp = headersList.get("x-real-ip");
    if (realIp) {
      return realIp.trim();
    }
  } catch {
    // Safe fallback for testing environment where next/headers is not present
  }
  return "127.0.0.1";
}

async function createAuditLog(action: string, details: string) {
  try {
    const ipAddress = await getClientIp();
    await prisma.auditLog.create({
      data: { action, details, ipAddress }
    });
  } catch (e) {
    console.warn("Audit log creation skipped: ", e);
  }
}

// 1. Authentication Server Actions
export async function adminLoginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const isProd = process.env.NODE_ENV === "production";
  const hasConfiguredCreds = process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD;

  if (isProd && !hasConfiguredCreds) {
    return { success: false, error: "System configuration error. Admin login is currently disabled on production until credentials are set in the environment variables." };
  }

  const expectedEmail = process.env.ADMIN_EMAIL || "admin@mimos.my";
  const expectedPassword = process.env.ADMIN_PASSWORD || "mimos2026";

  if (email === expectedEmail && password === expectedPassword) {
    await loginAdmin(email);
    await createAuditLog("ADMIN_LOGIN", `Admin ${email} logged in successfully`);
    return { success: true };
  }

  return { success: false, error: "Invalid email or password" };
}

export async function adminLogoutAction() {
  const admin = await getSessionAdmin();
  if (admin) {
    await createAuditLog("ADMIN_LOGOUT", `Admin ${admin.email} logged out`);
  }
  await logoutAdmin();
}

// 2. Program CMS Actions
export async function createProgramAction(data: {
  title: string;
  description: string;
  syllabus: string;
  location: string;
  price: string;
  duration: string;
  dates: string;
  microsoftFormUrl: string;
  categoryId: string;
  imageUrl?: string;
  imageUrls?: string[];
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  try {
    const newProgram = await prisma.program.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        syllabus: data.syllabus,
        location: data.location,
        price: data.price,
        duration: data.duration,
        dates: data.dates,
        microsoftFormUrl: data.microsoftFormUrl,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl || null,
        imageUrls: data.imageUrls || []
      }
    });

    await createAuditLog("CREATE_PROGRAM", `Created program: ${data.title} by admin ${admin.email}`);

    revalidatePath("/");
    revalidatePath("/programs/" + slug);
    return { success: true, program: newProgram };
  } catch (e) {
    console.error("Prisma program create error: ", e);
    return { success: false, error: "Failed to save the program to the database. Please try again." };
  }
}

export async function updateProgramAction(
  id: string,
  data: {
    title: string;
    description: string;
    syllabus: string;
    location: string;
    price: string;
    duration: string;
    dates: string;
    microsoftFormUrl: string;
    categoryId: string;
    imageUrl?: string;
    imageUrls?: string[];
  }
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  try {
    const updated = await prisma.program.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        syllabus: data.syllabus,
        location: data.location,
        price: data.price,
        duration: data.duration,
        dates: data.dates,
        microsoftFormUrl: data.microsoftFormUrl,
        categoryId: data.categoryId,
        imageUrl: data.imageUrl || null,
        imageUrls: data.imageUrls || []
      }
    });

    await createAuditLog("UPDATE_PROGRAM", `Updated program: ${data.title} by admin ${admin.email}`);

    revalidatePath("/");
    revalidatePath("/programs/" + slug);
    return { success: true, program: updated };
  } catch (e) {
    console.error("Prisma program update error: ", e);
    return { success: false, error: "Failed to update the program in the database. Please try again." };
  }
}

export async function deleteProgramAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.program.delete({
      where: { id }
    });

    await createAuditLog("DELETE_PROGRAM", `Deleted program: ${deleted.title} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Prisma program delete error: ", e);
    return { success: false, error: "Failed to delete the program from the database. Please try again." };
  }
}

// 3. Category Actions
export async function createCategoryAction(name: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  try {
    const category = await prisma.category.create({
      data: { name, slug }
    });
    revalidatePath("/");
    return { success: true, category };
  } catch (e) {
    console.error("Prisma category create error: ", e);
    return { success: false, error: "Failed to save the category to the database. Please try again." };
  }
}

// 6. Stats CRUD Actions
export async function createStatAction(data: { number: string; label: string }) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const newStat = await prisma.stat.create({
      data: {
        number: data.number,
        label: data.label,
      }
    });

    await createAuditLog("CREATE_STAT", `Created stat: ${data.number} - ${data.label} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true, stat: newStat };
  } catch (e) {
    console.error("Prisma stat create error: ", e);
    return { success: false, error: "Failed to save the stat to the database. Please try again." };
  }
}

export async function updateStatAction(id: string, data: { number: string; label: string }) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const updated = await prisma.stat.update({
      where: { id },
      data: {
        number: data.number,
        label: data.label,
      }
    });

    await createAuditLog("UPDATE_STAT", `Updated stat: ${data.number} - ${data.label} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true, stat: updated };
  } catch (e) {
    console.error("Prisma stat update error: ", e);
    return { success: false, error: "Failed to update the stat in the database. Please try again." };
  }
}

export async function deleteStatAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.stat.delete({
      where: { id }
    });

    await createAuditLog("DELETE_STAT", `Deleted stat: ${deleted.number} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Prisma stat delete error: ", e);
    return { success: false, error: "Failed to delete the stat from the database. Please try again." };
  }
}

// 7. Partners CRUD Actions
export async function createPartnerAction(data: { name: string; logoUrl: string }) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const newPartner = await prisma.partner.create({
      data: {
        name: data.name,
        logoUrl: data.logoUrl,
      }
    });

    await createAuditLog("CREATE_PARTNER", `Created partner: ${data.name} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true, partner: newPartner };
  } catch (e) {
    console.error("Prisma partner create error: ", e);
    return { success: false, error: "Failed to save the partner to the database. Please try again." };
  }
}

export async function updatePartnerAction(id: string, data: { name: string; logoUrl: string }) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const updated = await prisma.partner.update({
      where: { id },
      data: {
        name: data.name,
        logoUrl: data.logoUrl,
      }
    });

    await createAuditLog("UPDATE_PARTNER", `Updated partner: ${data.name} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true, partner: updated };
  } catch (e) {
    console.error("Prisma partner update error: ", e);
    return { success: false, error: "Failed to update the partner in the database. Please try again." };
  }
}

export async function deletePartnerAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.partner.delete({
      where: { id }
    });

    await createAuditLog("DELETE_PARTNER", `Deleted partner: ${deleted.name} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Prisma partner delete error: ", e);
    return { success: false, error: "Failed to delete the partner from the database. Please try again." };
  }
}

// 8. Why Choose Us Card CRUD Actions
export async function createWhyChooseUsCardAction(data: {
  title: string;
  description: string;
  imageUrl: string | null;
  colspan: number;
  order: number;
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const newCard = await prisma.whyChooseUsCard.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        colspan: data.colspan,
        order: data.order,
      }
    });

    await createAuditLog("CREATE_WHY_CHOOSE_US_CARD", `Created WhyChooseUs card: ${data.title} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true, card: newCard };
  } catch (e) {
    console.error("Prisma WhyChooseUs card create error: ", e);
    return { success: false, error: "Failed to save the card to the database. Please try again." };
  }
}

export async function updateWhyChooseUsCardAction(
  id: string,
  data: {
    title: string;
    description: string;
    imageUrl: string | null;
    colspan: number;
    order: number;
  }
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const updated = await prisma.whyChooseUsCard.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        colspan: data.colspan,
        order: data.order,
      }
    });

    await createAuditLog("UPDATE_WHY_CHOOSE_US_CARD", `Updated WhyChooseUs card: ${data.title} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true, card: updated };
  } catch (e) {
    console.error("Prisma WhyChooseUs card update error: ", e);
    return { success: false, error: "Failed to update the card in the database. Please try again." };
  }
}

export async function deleteWhyChooseUsCardAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.whyChooseUsCard.delete({
      where: { id }
    });

    await createAuditLog("DELETE_WHY_CHOOSE_US_CARD", `Deleted WhyChooseUs card: ${deleted.title} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Prisma WhyChooseUs card delete error: ", e);
    return { success: false, error: "Failed to delete the card from the database. Please try again." };
  }
}

// 9. Testimonial CRUD Actions
export async function createTestimonialAction(data: {
  quote: string;
  name: string;
  role: string;
  company: string;
  order: number;
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const newTestimonial = await prisma.testimonial.create({
      data: {
        quote: data.quote,
        name: data.name,
        role: data.role,
        company: data.company,
        order: data.order,
      }
    });

    await createAuditLog("CREATE_TESTIMONIAL", `Created testimonial for: ${data.name} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true, testimonial: newTestimonial };
  } catch (e) {
    console.error("Prisma testimonial create error: ", e);
    return { success: false, error: "Failed to save the testimonial to the database. Please try again." };
  }
}

export async function updateTestimonialAction(
  id: string,
  data: {
    quote: string;
    name: string;
    role: string;
    company: string;
    order: number;
  }
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        quote: data.quote,
        name: data.name,
        role: data.role,
        company: data.company,
        order: data.order,
      }
    });

    await createAuditLog("UPDATE_TESTIMONIAL", `Updated testimonial for: ${data.name} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true, testimonial: updated };
  } catch (e) {
    console.error("Prisma testimonial update error: ", e);
    return { success: false, error: "Failed to update the testimonial in the database. Please try again." };
  }
}

export async function deleteTestimonialAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.testimonial.delete({
      where: { id }
    });

    await createAuditLog("DELETE_TESTIMONIAL", `Deleted testimonial for: ${deleted.name} by admin ${admin.email}`);

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Prisma testimonial delete error: ", e);
    return { success: false, error: "Failed to delete the testimonial from the database. Please try again." };
  }
}

// 10. News Article CRUD Actions
export async function createNewsArticleAction(data: {
  title: string;
  category: string;
  date: string;
  description: string;
  content: string;
  imageUrl: string | null;
  isHighlighted: boolean;
  order: number;
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  // Enforce max 4 highlighted
  if (data.isHighlighted) {
    try {
      const highlightedCount = await prisma.newsArticle.count({ where: { isHighlighted: true } });
      if (highlightedCount >= 4) {
        return { success: false, error: "Maximum 4 highlighted articles allowed. Please un-highlight another article first." };
      }
    } catch (e) {
      console.error("Prisma highlighted count failed: ", e);
      return { success: false, error: "Unable to verify highlighted article count. Please try again." };
    }
  }

  try {
    const newArticle = await prisma.newsArticle.create({
      data: {
        title: data.title,
        category: data.category,
        date: data.date,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        isHighlighted: data.isHighlighted,
        order: data.order,
      }
    });

    await createAuditLog("CREATE_NEWS_ARTICLE", `Created news article: ${data.title} by admin ${admin.email}`);

    revalidatePath("/");
    revalidatePath("/news");
    return { success: true, article: newArticle };
  } catch (e) {
    console.error("Prisma news create error: ", e);
    return { success: false, error: "Failed to save the article to the database. Please try again." };
  }
}

export async function updateNewsArticleAction(
  id: string,
  data: {
    title: string;
    category: string;
    date: string;
    description: string;
    content: string;
    imageUrl: string | null;
    isHighlighted: boolean;
    order: number;
  }
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  // Enforce max 4 highlighted (exclude current article from count)
  if (data.isHighlighted) {
    try {
      const highlightedCount = await prisma.newsArticle.count({
        where: { isHighlighted: true, id: { not: id } }
      });
      if (highlightedCount >= 4) {
        return { success: false, error: "Maximum 4 highlighted articles allowed. Please un-highlight another article first." };
      }
    } catch (e) {
      console.error("Prisma highlighted count failed: ", e);
      return { success: false, error: "Unable to verify highlighted article count. Please try again." };
    }
  }

  try {
    const updated = await prisma.newsArticle.update({
      where: { id },
      data: {
        title: data.title,
        category: data.category,
        date: data.date,
        description: data.description,
        content: data.content,
        imageUrl: data.imageUrl,
        isHighlighted: data.isHighlighted,
        order: data.order,
      }
    });

    await createAuditLog("UPDATE_NEWS_ARTICLE", `Updated news article: ${data.title} by admin ${admin.email}`);

    revalidatePath("/");
    revalidatePath("/news");
    return { success: true, article: updated };
  } catch (e) {
    console.error("Prisma news update error: ", e);
    return { success: false, error: "Failed to update the article in the database. Please try again." };
  }
}

export async function deleteNewsArticleAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.newsArticle.delete({
      where: { id }
    });

    await createAuditLog("DELETE_NEWS_ARTICLE", `Deleted news article: ${deleted.title} by admin ${admin.email}`);

    revalidatePath("/");
    revalidatePath("/news");
    return { success: true };
  } catch (e) {
    console.error("Prisma news delete error: ", e);
    return { success: false, error: "Failed to delete the article from the database. Please try again." };
  }
}

export async function toggleNewsHighlightAction(id: string, isHighlighted: boolean) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  // Enforce max 4 highlighted when enabling
  if (isHighlighted) {
    try {
      const highlightedCount = await prisma.newsArticle.count({
        where: { isHighlighted: true, id: { not: id } }
      });
      if (highlightedCount >= 4) {
        return { success: false, error: "Maximum 4 highlighted articles allowed. Please un-highlight another article first." };
      }
    } catch (e) {
      console.error("Prisma highlighted count failed: ", e);
      return { success: false, error: "Unable to verify highlighted article count. Please try again." };
    }
  }

  try {
    await prisma.newsArticle.update({
      where: { id },
      data: { isHighlighted }
    });

    await createAuditLog("TOGGLE_NEWS_HIGHLIGHT", `${isHighlighted ? "Highlighted" : "Un-highlighted"} news article ID: ${id} by admin ${admin.email}`);

    revalidatePath("/");
    revalidatePath("/news");
    return { success: true };
  } catch (e) {
    console.error("Prisma news highlight toggle error: ", e);
    return { success: false, error: "Failed to update highlight status in the database. Please try again." };
  }
}

// 10. Facilities CRUD Actions
export async function createFacilityAction(data: {
  index: string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  desc: string;
  specs: string[];
  order: number;
  featured: boolean;
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const newFacility = await prisma.facility.create({
      data: {
        index: data.index,
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        desc: data.desc,
        specs: data.specs,
        order: data.order,
        featured: data.featured,
      }
    });

    await createAuditLog("CREATE_FACILITY", `Created facility: ${data.title} by admin ${admin.email}`);

    revalidatePath("/facilities");
    revalidatePath("/");
    return { success: true, facility: newFacility };
  } catch (e) {
    console.error("Prisma facility create error: ", e);
    return { success: false, error: "Failed to save the facility to the database. Please try again." };
  }
}

export async function updateFacilityAction(id: string, data: {
  index: string;
  title: string;
  subtitle: string;
  imageUrl?: string | null;
  desc: string;
  specs: string[];
  order: number;
  featured: boolean;
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const updated = await prisma.facility.update({
      where: { id },
      data: {
        index: data.index,
        title: data.title,
        subtitle: data.subtitle,
        imageUrl: data.imageUrl,
        desc: data.desc,
        specs: data.specs,
        order: data.order,
        featured: data.featured,
      }
    });

    await createAuditLog("UPDATE_FACILITY", `Updated facility: ${data.title} by admin ${admin.email}`);

    revalidatePath("/facilities");
    revalidatePath("/");
    return { success: true, facility: updated };
  } catch (e) {
    console.error("Prisma facility update error: ", e);
    return { success: false, error: "Failed to update the facility in the database. Please try again." };
  }
}

export async function deleteFacilityAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.facility.delete({
      where: { id }
    });

    await createAuditLog("DELETE_FACILITY", `Deleted facility: ${deleted.title} by admin ${admin.email}`);

    revalidatePath("/facilities");
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error("Prisma facility delete error: ", e);
    return { success: false, error: "Failed to delete the facility from the database. Please try again." };
  }
}

export type SaveUpcomingEventResult =
  | { success: true; event: UpcomingEvent }
  | { success: false; error: string };

export async function saveUpcomingEventAction(eventData: Partial<UpcomingEvent> & { title: string }): Promise<SaveUpcomingEventResult> {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  const isEdit = Boolean(eventData.id);
  const id = eventData.id || `evt-${Date.now()}`;

  const updatedItem: UpcomingEvent = {
    id,
    title: eventData.title,
    date: eventData.date || "TBD",
    rawDate: eventData.rawDate || new Date().toISOString().split("T")[0],
    category: eventData.category || "SEMINAR",
    isPast: Boolean(eventData.isPast),
    location: eventData.location || "MIMOS Berhad, Bukit Jalil",
    description: eventData.description || "",
    imageUrl: eventData.imageUrl || "",
    microsoftFormUrl: eventData.microsoftFormUrl || "",
    agenda: eventData.agenda || [],
    link: eventData.link || ""
  };

  try {
    await prisma.event.upsert({
      where: { id },
      update: {
        date: updatedItem.date,
        rawDate: updatedItem.rawDate ?? null,
        title: updatedItem.title,
        category: updatedItem.category,
        isPast: updatedItem.isPast,
        location: updatedItem.location ?? null,
        description: updatedItem.description ?? "",
        imageUrl: updatedItem.imageUrl ?? null,
        microsoftFormUrl: updatedItem.microsoftFormUrl ?? null,
        agenda: sanitizeEventAgenda(updatedItem.agenda),
        link: updatedItem.link ?? null,
      },
      create: {
        id,
        date: updatedItem.date,
        rawDate: updatedItem.rawDate ?? null,
        title: updatedItem.title,
        category: updatedItem.category,
        isPast: updatedItem.isPast,
        location: updatedItem.location ?? null,
        description: updatedItem.description ?? "",
        imageUrl: updatedItem.imageUrl ?? null,
        microsoftFormUrl: updatedItem.microsoftFormUrl ?? null,
        agenda: sanitizeEventAgenda(updatedItem.agenda),
        link: updatedItem.link ?? null,
      },
    });
  } catch (e) {
    console.error("Prisma Event save error: ", e);
    return { success: false, error: "Failed to save event. Please try again." };
  }

  await createAuditLog(
    isEdit ? "UPDATE_EVENT" : "CREATE_EVENT",
    `${isEdit ? "Updated" : "Created"} event: ${updatedItem.title} by admin ${admin.email}`
  );

  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/");
  return { success: true, event: updatedItem };
}

export type DeleteUpcomingEventResult =
  | { success: true }
  | { success: false; error: string };

export async function deleteUpcomingEventAction(id: string): Promise<DeleteUpcomingEventResult> {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    await prisma.event.delete({
      where: { id }
    });
  } catch (e) {
    console.error("Prisma Event delete error: ", e);
    return { success: false, error: "Failed to delete event. Please try again." };
  }

  await createAuditLog("DELETE_EVENT", `Deleted event ID: ${id} by admin ${admin.email}`);

  revalidatePath("/events");
  revalidatePath("/admin/events");
  revalidatePath("/");
  return { success: true };
}


