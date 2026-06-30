import { getSafeWhyChooseUsCards } from "@/lib/db";
import ManageWhyChooseUsClient from "@/components/admin/ManageWhyChooseUsClient";

export const dynamic = "force-dynamic";

export default async function AdminWhyChooseUsPage() {
  const cards = await getSafeWhyChooseUsCards();

  const typedCards = cards.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    imageUrl: c.imageUrl,
    colspan: c.colspan,
    order: c.order
  }));

  return (
    <ManageWhyChooseUsClient cards={typedCards} />
  );
}
