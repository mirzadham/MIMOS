"use server";

import { revalidatePath as nextRevalidatePath, revalidateTag } from "next/cache";
import { getSessionAdmin } from "@/lib/adminAuth";
import { prisma, mockCareers } from "@/lib/db";
import { headers } from "next/headers";
import { CAREER_CATEGORIES } from "@/data/careersData";

function revalidatePath(path: string) {
  nextRevalidatePath(path, "layout");
  revalidateTag("cms-content", { expire: 0 });
}

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
    // Safe fallback for test environment
  }
  return "127.0.0.1";
}

async function createAuditLog(action: string, details: string) {
  try {
    const ipAddress = await getClientIp();
    await prisma.auditLog.create({
      data: { action, details, ipAddress },
    });
  } catch (e) {
    console.warn("Audit log creation skipped: ", e);
  }
}

interface CareerInput {
  title: string;
  description: string;
  category: string;
  location: string;
  employmentType: string;
  applyUrl?: string;
}

const ALLOWED_CATEGORIES = CAREER_CATEGORIES.filter(
  (c) => c !== "View all"
) as readonly string[];

/**
 * Server-side validation shared by create/update. Returns an error message
 * or null when the payload is acceptable. Values are returned trimmed.
 */
function validateCareerData(data: CareerInput): { error: string } | { value: Required<Pick<CareerInput, "title" | "description" | "category" | "location" | "employmentType">> & Pick<CareerInput, "applyUrl"> } {
  const title = data.title?.trim() ?? "";
  const description = data.description?.trim() ?? "";
  const category = data.category?.trim() ?? "";
  const location = data.location?.trim() ?? "";
  const employmentType = data.employmentType?.trim() ?? "";
  const applyUrl = data.applyUrl?.trim() ?? "";

  if (!title) return { error: "Job title is required." };
  if (title.length > 150) return { error: "Job title must be 150 characters or fewer." };
  if (!description) return { error: "Job description is required." };
  if (description.length > 5000) return { error: "Job description must be 5000 characters or fewer." };
  if (!ALLOWED_CATEGORIES.includes(category)) return { error: "Invalid category." };
  if (!location) return { error: "Location is required." };
  if (location.length > 100) return { error: "Location must be 100 characters or fewer." };
  if (!employmentType) return { error: "Employment type is required." };
  if (employmentType.length > 50) return { error: "Employment type must be 50 characters or fewer." };
  if (applyUrl && !/^(https?:\/\/|mailto:)/i.test(applyUrl)) {
    return { error: "Apply link must be an http(s) or mailto URL." };
  }

  return { value: { title, description, category, location, employmentType, applyUrl } };
}

export async function getCareersAction() {
  try {
    const careers = await prisma.career.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: careers };
  } catch (e) {
    console.warn("Prisma query failed, falling back to mock careers: ", e);
    return { success: true, data: mockCareers };
  }
}

export async function createCareerAction(data: CareerInput) {
  const admin = await getSessionAdmin();
  if (!admin) return { success: false, error: "Unauthorized access" };

  const validated = validateCareerData(data);
  if ("error" in validated) return { success: false, error: validated.error };

  try {
    const count = await prisma.career.count();
    const newCareer = await prisma.career.create({
      data: {
        title: validated.value.title,
        description: validated.value.description,
        category: validated.value.category,
        location: validated.value.location,
        employmentType: validated.value.employmentType,
        applyUrl: validated.value.applyUrl || null,
        order: count,
      },
    });

    await createAuditLog(
      "CREATE_CAREER",
      `Created career listing '${validated.value.title}' in category ${validated.value.category}`
    );

    revalidatePath("/careers");
    revalidatePath("/admin/careers");
    revalidatePath("/");

    return { success: true, data: newCareer };
  } catch (e) {
    console.error("Prisma create failed: ", e);
    return {
      success: false,
      error: "Failed to save career listing. Please try again.",
    };
  }
}

export async function updateCareerAction(id: string, data: CareerInput) {
  const admin = await getSessionAdmin();
  if (!admin) return { success: false, error: "Unauthorized access" };

  const validated = validateCareerData(data);
  if ("error" in validated) return { success: false, error: validated.error };

  try {
    const updated = await prisma.career.update({
      where: { id },
      data: {
        title: validated.value.title,
        description: validated.value.description,
        category: validated.value.category,
        location: validated.value.location,
        employmentType: validated.value.employmentType,
        applyUrl: validated.value.applyUrl || null,
      },
    });

    await createAuditLog(
      "UPDATE_CAREER",
      `Updated career listing '${validated.value.title}' (ID: ${id})`
    );

    revalidatePath("/careers");
    revalidatePath("/admin/careers");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (e) {
    console.error("Prisma update failed: ", e);
    return {
      success: false,
      error: "Failed to update career listing. Please try again.",
    };
  }
}

export async function deleteCareerAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) return { success: false, error: "Unauthorized access" };

  try {
    await prisma.career.delete({
      where: { id },
    });

    await createAuditLog("DELETE_CAREER", `Deleted career listing ID: ${id}`);

    revalidatePath("/careers");
    revalidatePath("/admin/careers");
    revalidatePath("/");

    return { success: true };
  } catch (e) {
    console.error("Prisma delete failed: ", e);
    return {
      success: false,
      error: "Failed to delete career listing. Please try again.",
    };
  }
}
