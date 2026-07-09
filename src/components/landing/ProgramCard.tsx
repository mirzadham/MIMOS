import Link from "next/link";
import { GraduationCap } from "lucide-react";

interface ProgramCardProps {
  program: {
    id: string;
    title: string;
    slug: string;
    description: string;
    location: string;
    duration: string | null;
    price: string | null;
    category?: {
      name: string;
    };
    imageUrl?: string | null;
    imageUrls?: string[] | null;
    dates?: string | null;
  };
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const displayImageUrl = (program.imageUrls && program.imageUrls.length > 0)
    ? program.imageUrls[0]
    : program.imageUrl;

  const isHrdCorp = program.price?.toLowerCase().includes("hrd corp") || false;

  const formatPrice = (priceStr: string | null) => {
    if (!priceStr) return { main: "Enquire", sub: "Advisory Intake" };
    const lower = priceStr.toLowerCase();
    if (lower.includes("contact academy") || lower.includes("fee details")) {
      return { main: "Enquire", sub: "Contact Academy" };
    }
    const match = priceStr.match(/RM\s?[\d,]+/i);
    if (match) {
      return { main: match[0], sub: "/ pax" };
    }
    return { main: priceStr, sub: "" };
  };

  const parsedPrice = formatPrice(program.price);

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-0 transition-all duration-300">

      {/* Top Banner Image / Placeholder */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-50">
        <Link href={`/programs/${program.slug}`} className="block w-full h-full">
          {displayImageUrl ? (
            <img
              src={displayImageUrl}
              alt={program.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-50/50">
              <GraduationCap className="h-10 w-10 text-slate-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/5 via-transparent to-transparent" />
        </Link>

        {/* Floating Category Tag (Rich pastel theme, black text, no border, slightly rounded) */}
        <span className="absolute right-4 top-4 z-10 inline-flex items-center rounded-md bg-[#f8d3f6] px-3 py-1 text-[10px] font-semibold text-black shadow-sm select-none">
          {program.category?.name || "Upskilling"}
        </span>
      </div>

      {/* Card body container */}
      <div className="flex-1 flex flex-col justify-between p-7 sm:p-8 bg-white min-h-[260px] sm:min-h-[280px]">

        {/* Title & HRD Corp Badge (Badge right-aligned) */}
        <div className="flex-1 flex items-start justify-between gap-4">
          <Link href={`/programs/${program.slug}`} className="block flex-1">
            <h3 className="font-heading text-base font-semibold text-slate-900 leading-snug">
              {program.title}
            </h3>
          </Link>
          {isHrdCorp && (
            <span className="inline-block px-1.5 py-0.5 text-[9px] font-semibold text-slate-500 uppercase border border-slate-300 bg-white rounded-md tracking-wider shrink-0 select-none mt-0.5">
              HRD Corp
            </span>
          )}
        </div>

        {/* Divider 1 (Expand fully under title) */}
        <div className="border-t border-slate-100 -mx-7 sm:-mx-8 mt-6 mb-6" />

        {/* Duration/Location & Price */}
        <div className="flex items-end justify-between gap-4">
          {/* Duration & Location (Stacked) */}
          <div className="flex flex-col gap-1 text-[11px] font-semibold text-slate-400 font-sans leading-tight">
            {program.duration && (
              <span>{program.duration}</span>
            )}
            <span className="line-clamp-2">{program.location}</span>
          </div>

          {/* Price */}
          <div className="text-right flex flex-col justify-end shrink-0">
            <span className="text-lg font-semibold text-slate-900 leading-none">
              {parsedPrice.main}
            </span>
            {parsedPrice.sub && (
              <span className="text-[9px] font-semibold text-slate-400 mt-1 block uppercase tracking-wider font-sans">
                {parsedPrice.sub}
              </span>
            )}
          </div>
        </div>

        {/* Divider 2 (Expand fully under details) */}
        <div className="border-t border-slate-100 -mx-7 sm:-mx-8 mt-7 mb-6" />

        {/* Next Intake & Clickable Arrow */}
        <div className="flex items-center justify-between">
          {/* Next Intake with Horizontal Colored Underline */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <span className="text-slate-400 font-medium">Next Intake:</span>
              <span className="text-slate-800">{program.dates || "Scheduled Soon"}</span>
            </div>
            {/* Colored horizontal bar in MIMOS Orchid Magenta (33% card width) */}
            <div className="h-[4px] w-25 bg-primary rounded-full mt-1.5" />
          </div>

          {/* Clickable Elongated Arrow with Spring Effect */}
          <Link href={`/programs/${program.slug}`} aria-label={`View syllabus for ${program.title}`}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="h-5 w-8 text-slate-900 spring-arrow transition-colors hover:text-primary cursor-pointer"
            >
              <path d="M2 12h20M16 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}
