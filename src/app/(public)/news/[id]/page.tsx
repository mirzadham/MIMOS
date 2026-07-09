import { getSafeNewsArticleById } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";

export const dynamic = "force-dynamic";

interface NewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const article = await getSafeNewsArticleById(id);

  if (!article) {
    notFound();
  }

  const parseInlineMarkdown = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentText = text;
    let keyIdx = 0;

    while (currentText) {
      const boldIndex = currentText.indexOf("**");
      const linkIndex = currentText.indexOf("[");

      if (boldIndex === -1 && linkIndex === -1) {
        parts.push(currentText);
        break;
      }

      // If bold comes first
      if (boldIndex !== -1 && (linkIndex === -1 || boldIndex < linkIndex)) {
        if (boldIndex > 0) {
          parts.push(currentText.substring(0, boldIndex));
        }
        const nextBold = currentText.indexOf("**", boldIndex + 2);
        if (nextBold !== -1) {
          const boldText = currentText.substring(boldIndex + 2, nextBold);
          parts.push(
            <strong key={`bold-${keyIdx++}`} className="font-semibold text-slate-900">
              {boldText}
            </strong>
          );
          currentText = currentText.substring(nextBold + 2);
        } else {
          parts.push("**");
          currentText = currentText.substring(boldIndex + 2);
        }
      } else {
        // If link comes first
        if (linkIndex > 0) {
          parts.push(currentText.substring(0, linkIndex));
        }
        const closeBracket = currentText.indexOf("]", linkIndex);
        const openParen = currentText.indexOf("(", closeBracket);
        const closeParen = currentText.indexOf(")", openParen);

        if (closeBracket !== -1 && openParen === closeBracket + 1 && closeParen !== -1) {
          const linkText = currentText.substring(linkIndex + 1, closeBracket);
          const linkUrl = currentText.substring(openParen + 1, closeParen);
          parts.push(
            <a
              key={`link-${keyIdx++}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover hover:underline font-semibold transition-colors duration-200"
            >
              {linkText}
            </a>
          );
          currentText = currentText.substring(closeParen + 1);
        } else {
          parts.push("[");
          currentText = currentText.substring(linkIndex + 1);
        }
      }
    }

    return parts;
  };

  const formatNewsContent = (text: string) => {
    if (!text) return null;
    return text.split("\n\n").map((block, idx) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith("###")) {
        return (
          <h3 key={idx} className="text-[20px] font-semibold text-slate-900 leading-snug mt-6">
            {trimmed.replace("###", "").trim()}
          </h3>
        );
      }
      if (trimmed.startsWith("##")) {
        return (
          <h2 key={idx} className="text-[24px] font-semibold text-slate-900 leading-snug mt-8">
            {trimmed.replace("##", "").trim()}
          </h2>
        );
      }
      if (trimmed.startsWith("#")) {
        return (
          <h1 key={idx} className="text-[28px] font-semibold text-slate-900 leading-tight mt-10">
            {trimmed.replace("#", "").trim()}
          </h1>
        );
      }

      if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
        return (
          <h3 key={idx} className="text-[15px] font-semibold text-slate-900 mt-4">
            {trimmed.replace(/\*\*/g, "").trim()}
          </h3>
        );
      }

      return (
        <p key={idx} className="leading-[1.6]" style={{ marginBlockStart: "1em", marginBlockEnd: "1em" }}>
          {parseInlineMarkdown(trimmed)}
        </p>
      );
    });
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden pb-20">
      <div className="relative z-10 mx-auto max-w-[1080px] px-6 lg:px-8 pt-24 sm:pt-28">
        {/* Top sub-navigation bar (Stripe newsroom design) */}
        <div className="flex items-center justify-between py-5 border-b border-slate-200/40">
          <Link
            href="/news"
            className="text-[15px] font-semibold text-primary tracking-[-0.01em] hover:opacity-60 transition-opacity duration-200"
          >
            Newsroom
          </Link>
          <nav className="flex items-center gap-7">
            <Link
              href="/news?tab=news"
              className="text-[15px] font-semibold text-slate-900 hover:opacity-60 transition-opacity duration-200"
            >
              News
            </Link>
          </nav>
        </div>

        {/* Title Section */}
        <div className="pt-12 pb-6">
          <h1 className="text-[32px] sm:text-[40px] md:text-[48px] font-semibold leading-[1.15] text-slate-900 tracking-[-0.025em] md:max-w-[66.666%]">
            {article.title}
          </h1>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start pt-6">
          {/* Left Column: Date (15px / normal weight) */}
          <div className="md:col-span-3 flex items-start gap-2.5 pt-[5px]">
            <span className="block h-[15px] w-[1.5px] bg-primary rounded-full mt-[5px] shrink-0" />
            <span className="text-[15px] font-normal text-slate-500 tracking-tight">
              {article.date}
            </span>
          </div>

          {/* Right Column: Image and News Text */}
          <div className="md:col-span-9 space-y-8">
            {/* News Image with 1600/1067 aspect ratio */}
            {article.imageUrl && (
              <div
                className="relative w-full bg-slate-50 rounded-xl overflow-hidden shadow-[0_30px_60px_-12px_rgba(50,50,93,0.15),0_18px_36px_-18px_rgba(0,0,0,0.1)]"
                style={{ aspectRatio: "1600 / 1067" }}
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}

            {/* News Text block matching font specs and alignment */}
            <div className="ArticleMarkdown text-slate-600">
              {formatNewsContent(article.content || article.description)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
