import { prisma } from "@/lib/db";
import EnrollmentsClient from "@/components/admin/EnrollmentsClient";

export const dynamic = "force-dynamic";

interface DashboardEnrollment {
  id: string;
  name: string;
  email: string;
  company: string | null;
  registrationDate: Date;
  status: string;
  program: {
    title: string;
  };
}

export default async function AdminEnrollmentsPage() {
  let programs: Array<{ id: string; title: string }> = [];
  let enrollments: DashboardEnrollment[] = [];

  try {
    const [dbPrograms, dbEnrollments] = await Promise.all([
      prisma.program.findMany({
        select: { id: true, title: true },
        orderBy: { title: "asc" }
      }),
      prisma.enrollment.findMany({
        include: { program: { select: { title: true } } },
        orderBy: { registrationDate: "desc" }
      })
    ]);
    programs = dbPrograms;
    enrollments = dbEnrollments as unknown as DashboardEnrollment[];
  } catch {
    // DB offline fallback
    programs = [
      { id: "prog-1", title: "Advanced Wafer Fabrication & Lithography" },
      { id: "prog-2", title: "IC Design & Layout Verification" },
      { id: "prog-3", title: "Generative AI & LLM Deployment in Enterprise" }
    ];
    enrollments = [
      {
        id: "1",
        name: "Lim Wei Liang",
        email: "weiliang@microtech.my",
        company: "Micro Tech Sdn Bhd",
        registrationDate: new Date("2026-06-15T09:00:00Z"),
        status: "ATTENDED",
        program: { title: "Advanced Wafer Fabrication & Lithography" }
      },
      {
        id: "2",
        name: "Farah Diana",
        email: "farah@cybercorp.com.my",
        company: "CyberCorp Malaysia",
        registrationDate: new Date("2026-06-16T10:30:00Z"),
        status: "REGISTERED",
        program: { title: "Certified CyberSecurity Defense & Penetration Testing" }
      },
      {
        id: "3",
        name: "Ahmad Syazwan",
        email: "syazwan@mimos.my",
        company: "MIMOS Berhad",
        registrationDate: new Date("2026-06-14T11:00:00Z"),
        status: "CERTIFIED",
        program: { title: "Generative AI & LLM Deployment in Enterprise" }
      }
    ];
  }

  return (
    <EnrollmentsClient 
      programs={programs} 
      initialEnrollments={enrollments} 
    />
  );
}
