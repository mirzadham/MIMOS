import { prisma } from "@/lib/db";
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
    // Safe fallback for test environment
  }
  return "127.0.0.1";
}

export async function createAuditLog(action: string, details: string) {
  try {
    const ipAddress = await getClientIp();
    await prisma.auditLog.create({
      data: { action, details, ipAddress },
    });
  } catch (e) {
    console.warn("Audit log creation skipped: ", e);
  }
}
