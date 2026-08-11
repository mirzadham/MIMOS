import { getSafeCareers } from "@/lib/db";
import ManageCareersClient from "@/components/admin/ManageCareersClient";

export const metadata = {
  title: "Manage Careers | Admin Dashboard | MIMOS Academy",
};

export default async function AdminManageCareersPage() {
  const rawCareers = await getSafeCareers();

  const careers = rawCareers.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category,
    location: c.location,
    employmentType: c.employmentType,
    applyUrl: c.applyUrl,
  }));

  return <ManageCareersClient initialCareers={careers} />;
}
