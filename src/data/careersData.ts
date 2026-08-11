export interface JobListing {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string; // Location mode, e.g. "Remote", "On-site", "Hybrid"
  employmentType: string; // e.g. "Full-time", "Part-time"
  applyUrl?: string;
}

/**
 * Default category list including the "View all" pseudo-tab.
 * Used as a fallback for the public filter UI when the database is
 * unreachable. Live values come from CareerOption rows (kind = CATEGORY);
 * "View all" is a UI-only concept and is never stored.
 */
export const CAREER_CATEGORIES = [
  "View all",
  "Development",
  "Design",
  "Marketing",
  "Customer Service",
  "Operations",
  "Finance",
  "Management",
] as const;

/** Default categories stored as CareerOption rows (kind = CATEGORY). */
export const DEFAULT_CATEGORIES = [
  "Development",
  "Design",
  "Marketing",
  "Customer Service",
  "Operations",
  "Finance",
  "Management",
] as const;

/** Default employment types stored as CareerOption rows (kind = EMPLOYMENT_TYPE). */
export const DEFAULT_EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
] as const;

/** Default location modes stored as CareerOption rows (kind = LOCATION_MODE). */
export const DEFAULT_LOCATION_MODES = [
  "Remote",
  "On-site",
  "Hybrid",
] as const;

export type CategoryFilter = string;

export const SAMPLE_JOBS: JobListing[] = [
  {
    id: "job-1",
    title: "Product Designer",
    description: "We're looking for a mid-level product designer to join our team.",
    category: "Design",
    location: "Remote",
    employmentType: "Full-time",
    applyUrl: "https://forms.office.com/r/MIMOS01",
  },
  {
    id: "job-2",
    title: "Engineering Manager",
    description: "We're looking for an experienced engineering manager to join our team.",
    category: "Development",
    location: "Remote",
    employmentType: "Full-time",
    applyUrl: "https://forms.office.com/r/MIMOS02",
  },
  {
    id: "job-3",
    title: "Customer Success Manager",
    description: "We're looking for a customer success manager to join our team.",
    category: "Customer Service",
    location: "Remote",
    employmentType: "Full-time",
    applyUrl: "https://forms.office.com/r/MIMOS03",
  },
  {
    id: "job-4",
    title: "Senior Full Stack Engineer",
    description: "We're looking for a senior full stack developer passionate about scalable web applications.",
    category: "Development",
    location: "On-site",
    employmentType: "Full-time",
    applyUrl: "https://forms.office.com/r/MIMOS04",
  },
  {
    id: "job-5",
    title: "Growth Marketing Specialist",
    description: "We're looking for a data-driven growth marketer to scale our educational program reach.",
    category: "Marketing",
    location: "Remote",
    employmentType: "Full-time",
    applyUrl: "https://forms.office.com/r/MIMOS05",
  },
  {
    id: "job-6",
    title: "Operations & HR Lead",
    description: "We're looking for an operations lead to streamline internal workflows and talent onboarding.",
    category: "Operations",
    location: "On-site",
    employmentType: "Full-time",
    applyUrl: "https://forms.office.com/r/MIMOS06",
  },
  {
    id: "job-7",
    title: "Financial Analyst",
    description: "We're looking for a detail-oriented financial analyst to manage budgeting and strategic planning.",
    category: "Finance",
    location: "On-site",
    employmentType: "Full-time",
    applyUrl: "https://forms.office.com/r/MIMOS07",
  },
  {
    id: "job-8",
    title: "Director of Product Strategy",
    description: "We're looking for a visionary product leader to define the roadmap for MIMOS Academy platforms.",
    category: "Management",
    location: "Remote",
    employmentType: "Full-time",
    applyUrl: "https://forms.office.com/r/MIMOS08",
  },
  {
    id: "job-9",
    title: "UX Researcher",
    description: "We're looking for a UX researcher to conduct qualitative user testing and field studies.",
    category: "Design",
    location: "Remote",
    employmentType: "Part-time",
    applyUrl: "https://forms.office.com/r/MIMOS09",
  },
  {
    id: "job-10",
    title: "Support Operations Specialist",
    description: "We're looking for a dedicated specialist to support participant inquiries and portal access.",
    category: "Customer Service",
    location: "Remote",
    employmentType: "Full-time",
    applyUrl: "https://forms.office.com/r/MIMOS10",
  },
];
