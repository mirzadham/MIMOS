"use server";

import { revalidatePath } from "next/cache";
import { getSessionAdmin } from "@/lib/adminAuth";
import { prisma, mockTeamMembers, setMockAboutSettings, setMockTeamMembers } from "@/lib/db";

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
    setMockAboutSettings(data);
    revalidatePath("/about");
    return { success: true };
  }
}

export async function createTeamMemberAction(data: {
  name: string;
  role: string;
  imageUrl: string | null;
  initials: string;
}) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const count = await prisma.teamMember.count();
    const newMember = await prisma.teamMember.create({
      data: {
        name: data.name,
        role: data.role,
        imageUrl: data.imageUrl || null,
        initials: data.initials,
        order: count,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "CREATE_TEAM_MEMBER",
        details: `Created team member: ${data.name} by admin ${admin.email}`,
      },
    });

    revalidatePath("/about");
    return { success: true, member: newMember };
  } catch (e) {
    console.error("Prisma write error for team member: ", e);
    const newMock = {
      id: "mock-tm-" + Math.random().toString(36).substr(2, 9),
      name: data.name,
      role: data.role,
      imageUrl: data.imageUrl || null,
      initials: data.initials,
      order: mockTeamMembers.length,
    };
    setMockTeamMembers([...mockTeamMembers, newMock]);
    revalidatePath("/about");
    return { success: true, member: newMock };
  }
}

export async function updateTeamMemberAction(
  id: string,
  data: {
    name: string;
    role: string;
    imageUrl: string | null;
    initials: string;
    order: number;
  }
) {
  const admin = await getSessionAdmin();
  if (!admin) throw new Error("Unauthorized");

  try {
    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        imageUrl: data.imageUrl || null,
        initials: data.initials,
        order: data.order,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_TEAM_MEMBER",
        details: `Updated team member: ${data.name} by admin ${admin.email}`,
      },
    });

    revalidatePath("/about");
    return { success: true, member: updated };
  } catch (e) {
    console.error("Prisma update error for team member: ", e);
    setMockTeamMembers(
      mockTeamMembers.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
    revalidatePath("/about");
    return { success: true };
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
    setMockTeamMembers(mockTeamMembers.filter((m) => m.id !== id));
    revalidatePath("/about");
    return { success: true };
  }
}
