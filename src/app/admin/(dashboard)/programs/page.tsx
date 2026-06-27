import { getSafeCategories, getSafePrograms } from "@/lib/db";
import ManageProgramsClient from "@/components/admin/ManageProgramsClient";

export const dynamic = "force-dynamic";

export default async function AdminProgramsPage() {
  const [categories, programs] = await Promise.all([
    getSafeCategories(),
    getSafePrograms()
  ]);

  // Adapt database objects to fit the type contract of Client component
  const typedCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug
  }));

  const typedPrograms = (programs as Array<{
    id: string;
    title: string;
    slug: string;
    description: string;
    syllabus: string;
    location: string;
    price: string | null;
    duration: string | null;
    dates: string | null;
    microsoftFormUrl: string;
    categoryId: string;
    category?: { name: string } | null;
  }>).map(prog => ({
    id: prog.id,
    title: prog.title,
    slug: prog.slug,
    description: prog.description,
    syllabus: prog.syllabus,
    location: prog.location,
    price: prog.price,
    duration: prog.duration,
    dates: prog.dates,
    microsoftFormUrl: prog.microsoftFormUrl,
    categoryId: prog.categoryId,
    category: prog.category ? { name: prog.category.name } : undefined
  }));

  return (
    <ManageProgramsClient 
      categories={typedCategories} 
      programs={typedPrograms} 
    />
  );
}
