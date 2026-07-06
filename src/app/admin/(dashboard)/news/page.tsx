import { getSafeNewsArticles } from "@/lib/db";
import ManageNewsClient from "@/components/admin/ManageNewsClient";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  const articles = await getSafeNewsArticles();

  const typedArticles = articles.map(a => ({
    id: a.id,
    title: a.title,
    category: a.category,
    date: a.date,
    description: a.description,
    content: a.content || "",
    imageUrl: a.imageUrl ?? null,
    isHighlighted: a.isHighlighted,
    order: a.order
  }));

  return (
    <ManageNewsClient articles={typedArticles} />
  );
}
