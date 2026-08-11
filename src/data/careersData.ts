export interface JobListing {
  id: string;
  title: string;
  description: string;
  category: "Development" | "Design" | "Marketing" | "Customer Service" | "Operations" | "Finance" | "Management";
  location: string;
  employmentType: string;
  applyUrl?: string;
}

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

export type CategoryFilter = (typeof CAREER_CATEGORIES)[number];

export const SAMPLE_JOBS: JobListing[] = [
  {
    id: "job-1",
    title: "Product Designer",
    description: "We're looking for a mid-level product designer to join our team.",
    category: "Design",
    location: "100% remote",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@mimos.my?subject=Application%20for%20Product%20Designer",
  },
  {
    id: "job-2",
    title: "Engineering Manager",
    description: "We're looking for an experienced engineering manager to join our team.",
    category: "Development",
    location: "100% remote",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@mimos.my?subject=Application%20for%20Engineering%20Manager",
  },
  {
    id: "job-3",
    title: "Customer Success Manager",
    description: "We're looking for a customer success manager to join our team.",
    category: "Customer Service",
    location: "100% remote",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@mimos.my?subject=Application%20for%20Customer%20Success%20Manager",
  },
  {
    id: "job-4",
    title: "Senior Full Stack Engineer",
    description: "We're looking for a senior full stack developer passionate about scalable web applications.",
    category: "Development",
    location: "Kuala Lumpur, Malaysia",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@mimos.my?subject=Application%20for%20Senior%20Full%20Stack%20Engineer",
  },
  {
    id: "job-5",
    title: "Growth Marketing Specialist",
    description: "We're looking for a data-driven growth marketer to scale our educational program reach.",
    category: "Marketing",
    location: "100% remote",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@mimos.my?subject=Application%20for%20Growth%20Marketing%20Specialist",
  },
  {
    id: "job-6",
    title: "Operations & HR Lead",
    description: "We're looking for an operations lead to streamline internal workflows and talent onboarding.",
    category: "Operations",
    location: "Kuala Lumpur, Malaysia",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@mimos.my?subject=Application%20for%20Operations%20%26%20HR%20Lead",
  },
  {
    id: "job-7",
    title: "Financial Analyst",
    description: "We're looking for a detail-oriented financial analyst to manage budgeting and strategic planning.",
    category: "Finance",
    location: "Kulim, Kedah",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@mimos.my?subject=Application%20for%20Financial%20Analyst",
  },
  {
    id: "job-8",
    title: "Director of Product Strategy",
    description: "We're looking for a visionary product leader to define the roadmap for MIMOS Academy platforms.",
    category: "Management",
    location: "100% remote",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@mimos.my?subject=Application%20for%20Director%20of%20Product%20Strategy",
  },
  {
    id: "job-9",
    title: "UX Researcher",
    description: "We're looking for a UX researcher to conduct qualitative user testing and field studies.",
    category: "Design",
    location: "100% remote",
    employmentType: "Part-time",
    applyUrl: "mailto:careers@mimos.my?subject=Application%20for%20UX%20Researcher",
  },
  {
    id: "job-10",
    title: "Support Operations Specialist",
    description: "We're looking for a dedicated specialist to support participant inquiries and portal access.",
    category: "Customer Service",
    location: "100% remote",
    employmentType: "Full-time",
    applyUrl: "mailto:careers@mimos.my?subject=Application%20for%20Support%20Operations%20Specialist",
  },
];
