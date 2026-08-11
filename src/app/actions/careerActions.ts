"use server";

import { revalidatePath as nextRevalidatePath, revalidateTag } from "next/cache";
import { getSessionAdmin } from "@/lib/adminAuth";
import { prisma, mockCareers, setMockCareers } from "@/lib/db";
import { headers } from "next/headers";

function revalidatePath(path: string) {
  nextRevalidatePath(path, "layout");
  (revalidateTag as unknown as (tag: string) => void)("cms-content");
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

export async function getCareersAction() {
  try {
    const careers = await prisma.career.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: careers.length > 0 ? careers : mockCareers };
  } catch (e) {
    console.warn("Prisma query failed, falling back to mock careers: ", e);
    return { success: true, data: mockCareers };
  }
}

export async function createCareerAction(data: {
  title: string;
  description: string;
  category: string;
  location: string;
  employmentType: string;
  applyUrl?: string;
}) {
  const admin = await getSessionAdmin();
  if (!admin) return { success: false, error: "Unauthorized access" };

  try {
    const count = await prisma.career.count().catch(() => mockCareers.length);
    const newCareer = await prisma.career.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        employmentType: data.employmentType,
        applyUrl: data.applyUrl || null,
        order: count,
      },
    });

    await createAuditLog(
      "CREATE_CAREER",
      `Created career listing '${data.title}' in category ${data.category}`
    );

    revalidatePath("/careers");
    revalidatePath("/admin/careers");
    revalidatePath("/");

    return { success: true, data: newCareer };
  } catch (e) {
    console.warn("Prisma create failed, falling back to mock state update: ", e);
    const mockItem = {
      id: `job-${Date.now()}`,
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      employmentType: data.employmentType,
      applyUrl: data.applyUrl || null,
      order: mockCareers.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setMockCareers([mockItem, ...mockCareers]);

    revalidatePath("/careers");
    revalidatePath("/admin/careers");
    revalidatePath("/");

    return { success: true, data: mockItem };
  }
}

export async function updateCareerAction(
  id: string,
  data: {
    title: string;
    description: string;
    category: string;
    location: string;
    employmentType: string;
    applyUrl?: string;
  }
) {
  const admin = await getSessionAdmin();
  if (!admin) return { success: false, error: "Unauthorized access" };

  try {
    const updated = await prisma.career.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        employmentType: data.employmentType,
        applyUrl: data.applyUrl || null,
      },
    });

    await createAuditLog(
      "UPDATE_CAREER",
      `Updated career listing '${data.title}' (ID: ${id})`
    );

    revalidatePath("/careers");
    revalidatePath("/admin/careers");
    revalidatePath("/");

    return { success: true, data: updated };
  } catch (e) {
    console.warn("Prisma update failed, updating mock state: ", e);
    const updatedMock = mockCareers.map((item) =>
      item.id === id
        ? {
            ...item,
            title: data.title,
            description: data.description,
            category: data.category,
            location: data.location,
            employmentType: data.employmentType,
            applyUrl: data.applyUrl || null,
            updatedAt: new Date(),
          }
        : item
    );
    setMockCareers(updatedMock);

    revalidatePath("/careers");
    revalidatePath("/admin/careers");
    revalidatePath("/");

    return {
      success: true,
      data: updatedMock.find((item) => item.id === id),
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
    console.warn("Prisma delete failed, updating mock state: ", e);
    setMockCareers(mockCareers.filter((item) => item.id !== id));

    revalidatePath("/careers");
    revalidatePath("/admin/careers");
    revalidatePath("/");

    return { success: true };
  }
}
