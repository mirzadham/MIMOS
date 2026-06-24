import { prisma } from "@/lib/db";
import CertificatesClient from "@/components/admin/CertificatesClient";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  let enrollments: any[] = [];

  try {
    enrollments = await prisma.enrollment.findMany({
      where: {
        status: { in: ["ATTENDED", "CERTIFIED"] }
      },
      include: {
        program: { select: { id: true, title: true } },
        certificates: {
          select: {
            certificateNumber: true,
            verifyHash: true,
            issueDate: true
          },
          orderBy: { issueDate: "desc" }
        }
      },
      orderBy: { updatedAt: "desc" }
    });
  } catch (e) {
    // DB offline mock fallback
    enrollments = [
      {
        id: "1",
        name: "Lim Wei Liang",
        email: "weiliang@microtech.my",
        company: "Micro Tech Sdn Bhd",
        status: "ATTENDED",
        programId: "prog-1",
        program: { id: "prog-1", title: "Advanced Wafer Fabrication & Lithography" },
        certificates: []
      },
      {
        id: "3",
        name: "Ahmad Syazwan",
        email: "syazwan@mimos.my",
        company: "MIMOS Berhad",
        status: "CERTIFIED",
        programId: "prog-3",
        program: { id: "prog-3", title: "Generative AI & LLM Deployment in Enterprise" },
        certificates: [
          {
            certificateNumber: "MA-2026-8942",
            verifyHash: "d5a8c9e120f4b361a9d8e6c710d54c8e76a0d4b8e2194b0a51c8e71694f8e6c7",
            issueDate: new Date()
          }
        ]
      }
    ];
  }

  return (
    <CertificatesClient enrollments={enrollments} />
  );
}
