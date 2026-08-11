import { getSafeCareers, getSafeCareerOptions } from "@/lib/db";
import ManageCareersClient from "@/components/admin/ManageCareersClient";

export const metadata = {
  title: "Manage Careers | Admin Dashboard | MIMOS Academy",
};

export default async function AdminManageCareersPage() {
  const [rawCareers, options] = await Promise.all([
    getSafeCareers(),
    getSafeCareerOptions(),
  ]);

  const careers = rawCareers.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category,
    location: c.location,
    employmentType: c.employmentType,
    applyUrl: c.applyUrl,
  }));

  return <ManageCareersClient initialCareers={careers} initialOptions={options} />;
}
