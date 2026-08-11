import { Metadata } from "next";
import CareerHero from "@/components/careers/CareerHero";
import CareersContent from "@/components/careers/CareersContent";
import { getSafeCareers } from "@/lib/db";
import { JobListing } from "@/data/careersData";

// Careers are managed live by admins; always render against the current
// database instead of baking a build-time snapshot (mock fallback) into
// static HTML.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Careers | MIMOS Academy",
  description:
    "Join our team at MIMOS Academy. Explore career opportunities in engineering, design, marketing, customer service, operations, finance, and management.",
};

export default async function CareersPage() {
  const rawCareers = await getSafeCareers();

  const careers: JobListing[] = rawCareers.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category as JobListing["category"],
    location: c.location,
    employmentType: c.employmentType,
    applyUrl: c.applyUrl || undefined,
  }));

  return (
    <div className="w-full">
      <CareerHero />
      <CareersContent initialJobs={careers} />
    </div>
  );
}
