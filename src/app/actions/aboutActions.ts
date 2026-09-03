"use server";

import { revalidatePath as nextRevalidatePath, revalidateTag } from "next/cache";

function revalidatePath(path: string) {
  nextRevalidatePath(path);
  revalidateTag("cms-content", { expire: 0 });
}
import { getSessionAdmin } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";

// About Settings and Team Management Actions
export async function updateAboutSettingsAction(data: { mission: string; vision: string }) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const existing = await prisma.aboutSettings.findFirst();
    let updated;
    if (existing) {
      updated = await prisma.aboutSettings.update({
        where: { id: existing.id },
        data: {
          mission: data.mission,
          vision: data.vision,
        },
      });
    } else {
      updated = await prisma.aboutSettings.create({
        data: {
          mission: data.mission,
          vision: data.vision,
        },
      });
    }

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_ABOUT_SETTINGS",
        details: `Updated Mission/Vision settings by admin ${admin.email}`,
      },
    });

    revalidatePath("/about");
    return { success: true, settings: updated };
  } catch (e) {
    console.error("Prisma write error for about settings: ", e);
    return { success: false, error: "Failed to save about settings to the database. Please try again." };
  }
}

export async function createTeamMemberAction(data: {
  name: string;
  role: string;
  imageUrl: string | null;
  initials: string;
  level?: number;
  order?: number;
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  const levelVal = Math.max(1, Math.min(10, Math.floor(Number(data.level) || 1)));

  try {
    const count = await prisma.teamMember.count({
      where: { level: levelVal }
    });
    const orderVal = typeof data.order === "number" && !isNaN(data.order) ? data.order : count;

    const newMember = await prisma.teamMember.create({
      data: {
        name: data.name.trim(),
        role: data.role.trim(),
        imageUrl: data.imageUrl || null,
        initials: data.initials.trim(),
        level: levelVal,
        order: orderVal,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_TEAM_MEMBER",
        details: `Created team member: ${data.name} (Level ${levelVal}) by admin ${admin.email}`,
      },
    });

    revalidatePath("/about");
    return { success: true, member: newMember };
  } catch (e) {
    console.error("Prisma write error for team member: ", e);
    return { success: false, error: "Failed to save the team member to the database. Please try again." };
  }
}

export async function updateTeamMemberAction(
  id: string,
  data: {
    name: string;
    role: string;
    imageUrl: string | null;
    initials: string;
    level?: number;
    order: number;
  }
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  const levelVal = typeof data.level !== "undefined"
    ? Math.max(1, Math.min(10, Math.floor(Number(data.level) || 1)))
    : undefined;

  try {
    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        name: data.name.trim(),
        role: data.role.trim(),
        imageUrl: data.imageUrl || null,
        initials: data.initials.trim(),
        ...(levelVal ? { level: levelVal } : {}),
        order: data.order,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_TEAM_MEMBER",
        details: `Updated team member: ${data.name}${levelVal ? ` (Level ${levelVal})` : ""} by admin ${admin.email}`,
      },
    });

    revalidatePath("/about");
    return { success: true, member: updated };
  } catch (e) {
    console.error("Prisma update error for team member: ", e);
    return { success: false, error: "Failed to update the team member in the database. Please try again." };
  }
}

export async function deleteTeamMemberAction(id: string) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const deleted = await prisma.teamMember.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        action: "DELETE_TEAM_MEMBER",
        details: `Deleted team member: ${deleted.name} by admin ${admin.email}`,
      },
    });

    revalidatePath("/about");
    return { success: true };
  } catch (e) {
    console.error("Prisma delete error for team member: ", e);
    return { success: false, error: "Failed to delete the team member from the database. Please try again." };
  }
}
