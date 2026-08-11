"use server";

import { revalidatePath as nextRevalidatePath, revalidateTag } from "next/cache";
import { getSessionAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";
import { createAuditLog } from "@/lib/auditLog";
import type { CareerOptionKind } from "@/lib/db";

function revalidatePath(path: string) {
  nextRevalidatePath(path, "layout");
  revalidateTag("cms-content", { expire: 0 });
}

const ALLOWED_KINDS: readonly CareerOptionKind[] = [
  "CATEGORY",
  "EMPLOYMENT_TYPE",
  "LOCATION_MODE",
];

const KIND_LABELS: Record<CareerOptionKind, string> = {
  CATEGORY: "category",
  EMPLOYMENT_TYPE: "employment type",
  LOCATION_MODE: "location mode",
};

type CareerField = "category" | "employmentType" | "location";

// Career column that stores the option name for each kind.
const CAREER_FIELD_BY_KIND: Record<CareerOptionKind, CareerField> = {
  CATEGORY: "category",
  EMPLOYMENT_TYPE: "employmentType",
  LOCATION_MODE: "location",
};

function isValidKind(kind: string): kind is CareerOptionKind {
  return ALLOWED_KINDS.includes(kind as CareerOptionKind);
}

function cleanOptionName(name: string): { error: string } | { name: string } {
  const trimmed = name?.trim() ?? "";
  if (!trimmed) return { error: "Option name is required." };
  if (trimmed.length > 50) return { error: "Option name must be 50 characters or fewer." };
  return { name: trimmed };
}

/** Typed where-filter for the Career column that stores a given option kind. */
function careerFieldFilter(
  field: CareerField,
  value: string
): { category: string } | { employmentType: string } | { location: string } {
  switch (field) {
    case "category":
      return { category: value };
    case "employmentType":
      return { employmentType: value };
    default:
      return { location: value };
  }
}

export async function createCareerOptionAction(kind: string, name: string) {
  const admin = await getSessionAdmin();
  if (!admin) return { success: false, error: "Unauthorized access" };

  if (!isValidKind(kind)) return { success: false, error: "Invalid option type." };

  const cleaned = cleanOptionName(name);
  if ("error" in cleaned) return { success: false, error: cleaned.error };

  try {
    const existing = await prisma.careerOption.findUnique({
      where: { kind_name: { kind, name: cleaned.name } },
    });
    if (existing) {
      return { success: false, error: `"${cleaned.name}" already exists.` };
    }

    const count = await prisma.careerOption.count({ where: { kind } });
    const option = await prisma.careerOption.create({
      data: { kind, name: cleaned.name, order: count },
    });

    await createAuditLog(
      "CREATE_CAREER_OPTION",
      `Created ${KIND_LABELS[kind]} '${cleaned.name}'`
    );

    revalidatePath("/careers");
    revalidatePath("/admin/careers");

    return { success: true, data: option };
  } catch (e) {
    console.error("Prisma career option create failed: ", e);
    return {
      success: false,
      error: "Failed to save option. Please try again.",
    };
  }
}

export async function updateCareerOptionAction(id: string, name: string) {
  const admin = await getSessionAdmin();
  if (!admin) return { success: false, error: "Unauthorized access" };

  const cleaned = cleanOptionName(name);
  if ("error" in cleaned) return { success: false, error: cleaned.error };

  try {
    const option = await prisma.careerOption.findUnique({ where: { id } });
    if (!option) return { success: false, error: "Option not found." };

    // Renaming to the same name is a no-op success.
    if (option.name === cleaned.name) return { success: true, data: option };

    const duplicate = await prisma.careerOption.findUnique({
      where: { kind_name: { kind: option.kind, name: cleaned.name } },
    });
    if (duplicate) {
      return { success: false, error: `"${cleaned.name}" already exists.` };
    }

    const field = CAREER_FIELD_BY_KIND[option.kind];
    const oldName = option.name;

    // Rename the option AND rebind careers that reference the old name,
    // so no listing is left pointing at a non-existent option.
    await prisma.$transaction([
      prisma.careerOption.update({
        where: { id },
        data: { name: cleaned.name },
      }),
      prisma.career.updateMany({
        where: careerFieldFilter(field, oldName),
        data: careerFieldFilter(field, cleaned.name),
      }),
    ]);

    await createAuditLog(
      "UPDATE_CAREER_OPTION",
      `Renamed ${KIND_LABELS[option.kind]} '${oldName}' to '${cleaned.name}'`
    );

    revalidatePath("/careers");
    revalidatePath("/admin/careers");

    return { success: true, data: { ...option, name: cleaned.name } };
  } catch (e) {
    console.error("Prisma career option update failed: ", e);
    return {
      success: false,
      error: "Failed to rename option. Please try again.",
    };
  }
}

export async function deleteCareerOptionAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) return { success: false, error: "Unauthorized access" };

  try {
    const option = await prisma.careerOption.findUnique({ where: { id } });
    if (!option) return { success: false, error: "Option not found." };

    // Keep at least one option per kind so forms always have choices.
    const kindCount = await prisma.careerOption.count({ where: { kind: option.kind } });
    if (kindCount <= 1) {
      return {
        success: false,
        error: `At least one ${KIND_LABELS[option.kind]} is required.`,
      };
    }

    const field = CAREER_FIELD_BY_KIND[option.kind];
    const usage = await prisma.career.count({
      where: careerFieldFilter(field, option.name),
    });
    if (usage > 0) {
      return {
        success: false,
        error: `Cannot delete "${option.name}": ${usage} position(s) currently use it. Edit those positions first.`,
      };
    }

    await prisma.careerOption.delete({ where: { id } });

    await createAuditLog(
      "DELETE_CAREER_OPTION",
      `Deleted ${KIND_LABELS[option.kind]} '${option.name}'`
    );

    revalidatePath("/careers");
    revalidatePath("/admin/careers");

    return { success: true };
  } catch (e) {
    console.error("Prisma career option delete failed: ", e);
    return {
      success: false,
      error: "Failed to delete option. Please try again.",
    };
  }
}
