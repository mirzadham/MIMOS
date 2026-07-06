import { getSafeNewsArticles, getSafeHighlightedNews } from "@/lib/db";
import NewsPageClient from "./NewsPageClient";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const [allArticles, highlightedArticles] = await Promise.all([
    getSafeNewsArticles(),
    getSafeHighlightedNews()
  ]);

  const articles = allArticles.map((a: any) => ({
    id: a.id,
    title: a.title,
    category: a.category,
    date: a.date,
    desc: a.description,
    image: a.imageUrl || "/semiconductor_cleanroom.png",
  }));

  const featured = highlightedArticles.map((a: any) => ({
    id: a.id,
    category: a.category,
    title: a.title,
    image: a.imageUrl || "/semiconductor_cleanroom.png",
    barColor: "",
    tagColor: "#ff26b9",
  }));

  // Assign gradient colors to the featured bar
  const barGradients = [
    "linear-gradient(90deg, #ffe5f9, #ffbde8)",
    "linear-gradient(90deg, #ffbde8, #ff8ae2)",
    "linear-gradient(90deg, #ff8ae2, #ff47cb)",
    "linear-gradient(90deg, #ff47cb, #ff00aa)",
  ];
  featured.forEach((f: any, i: number) => {
    f.barColor = barGradients[i % barGradients.length];
  });

  return <NewsPageClient articles={articles} featuredStories={featured} />;
}
