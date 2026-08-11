"use server";

import { revalidatePath as nextRevalidatePath, revalidateTag } from "next/cache";
import { getSessionAdmin } from "@/lib/adminAuth";
import { prisma, getSafeCareerOptions } from "@/lib/db";
import { createAuditLog } from "@/lib/auditLog";

function revalidatePath(path: string) {
  nextRevalidatePath(path, "layout");
  revalidateTag("cms-content", { expire: 0 });
}

interface CareerInput {
  title: string;
  description: string;
  category: string;
  location: string;
  employmentType: string;
  applyUrl: string; // Microsoft Form URL (redirection link), e.g. https://forms.office.com/r/...
}

/**
 * Server-side validation shared by create/update. Returns an error message
 * or null when the payload is acceptable. Values are returned trimmed.
 * Category, employment type and location are validated against the managed
 * CareerOption lists (with a defaults fallback when the DB is unreachable).
 * The apply link is required and must be a Microsoft Form URL.
 */
async function validateCareerData(data: CareerInput): Promise<{ error: string } | { value: Required<Pick<CareerInput, "title" | "description" | "category" | "location" | "employmentType">> & Pick<CareerInput, "applyUrl"> }> {
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
  if (!location) return { error: "Location is required." };
  if (location.length > 100) return { error: "Location must be 100 characters or fewer." };
  if (!employmentType) return { error: "Employment type is required." };
  if (employmentType.length > 50) return { error: "Employment type must be 50 characters or fewer." };
  if (!applyUrl) return { error: "Microsoft Form link is required." };
  if (!/^https:\/\/forms\.office\.com(\/|$)/i.test(applyUrl)) {
    return { error: "Microsoft Form link must be a valid https://forms.office.com URL." };
  }

  try {
    const [categories, employmentTypes, locationModes] = await Promise.all([
      getSafeCareerOptions("CATEGORY"),
      getSafeCareerOptions("EMPLOYMENT_TYPE"),
      getSafeCareerOptions("LOCATION_MODE"),
    ]);

    if (!categories.some((o) => o.name === category)) {
      return { error: "Invalid category." };
    }
    if (!employmentTypes.some((o) => o.name === employmentType)) {
      return { error: "Invalid employment type." };
    }
    if (!locationModes.some((o) => o.name === location)) {
      return { error: "Invalid location mode." };
    }
  } catch (e) {
    console.error("Career option validation failed: ", e);
    return { error: "Invalid category." };
  }

  return { value: { title, description, category, location, employmentType, applyUrl } };
}

export async function createCareerAction(data: CareerInput) {
  const admin = await getSessionAdmin();
  if (!admin) return { success: false, error: "Unauthorized access" };

  const validated = await validateCareerData(data);
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

  const validated = await validateCareerData(data);
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
