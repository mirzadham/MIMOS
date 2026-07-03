import { getSafeTestimonials } from "@/lib/db";
import ManageTestimonialsClient from "@/components/admin/ManageTestimonialsClient";

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  const testimonials = await getSafeTestimonials();

  const typedTestimonials = testimonials.map(t => ({
    id: t.id,
    quote: t.quote,
    name: t.name,
    role: t.role,
    company: t.company,
    order: t.order
  }));

  return (
    <ManageTestimonialsClient testimonials={typedTestimonials} />
  );
}
