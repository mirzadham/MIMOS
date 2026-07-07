import { getSafeNewsArticles, getSafeHighlightedNews } from "@/lib/db";
import NewsPageClient from "./NewsPageClient";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const [allArticles, highlightedArticles] = await Promise.all([
    getSafeNewsArticles(),
    getSafeHighlightedNews()
  ]);

  const articles = allArticles.map((a) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    date: a.date,
    desc: a.description,
    image: a.imageUrl || "/semiconductor_cleanroom.png",
  }));

  const featured = highlightedArticles.map((a) => ({
    id: a.id,
    category: a.category,
    title: a.title,
    image: a.imageUrl || "/semiconductor_cleanroom.png",
    barColor: "",
    tagColor: "var(--primary)",
  }));

  // Assign gradient colors to the featured bar
  const barGradients = [
    "linear-gradient(90deg, #fbf5fa, #f3dced)",
    "linear-gradient(90deg, #f3dced, #e6bada)",
    "linear-gradient(90deg, #e6bada, #c576af)",
    "linear-gradient(90deg, #c576af, #a72190)",
  ];
  featured.forEach((f, i) => {
    f.barColor = barGradients[i % barGradients.length];
  });

  return <NewsPageClient articles={articles} featuredStories={featured} />;
}
