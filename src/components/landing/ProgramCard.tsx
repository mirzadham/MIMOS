import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 transition-all duration-300">
      
      {/* Top Banner Image / Placeholder */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-200">
        <Link href={`/programs/${program.slug}`} className="block w-full h-full">
          {displayImageUrl ? (
            <img
              src={displayImageUrl}
              alt={program.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-50/50">
              <GraduationCap className="h-10 w-10 text-slate-350" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 via-transparent to-transparent" />
        </Link>
        
        {/* Floating Category Tag (Pastel theme, black text, no border) */}
        <span className="absolute right-4 top-4 z-10 inline-flex items-center rounded-full bg-[#fdf2fc] px-3 py-1 text-[10px] font-extrabold text-black shadow-sm select-none">
          {program.category?.name || "Upskilling"}
        </span>
      </div>

      {/* Card body container */}
      <div className="flex-1 flex flex-col justify-between p-6 bg-white">
        
        {/* Title & HRD Corp Badge */}
        <div className="flex-1">
          <Link href={`/programs/${program.slug}`} className="block">
            <h3 className="font-heading text-base font-extrabold text-slate-900 leading-snug">
              {program.title}
              {isHrdCorp && (
                <span className="ml-2 inline-block align-middle px-1.5 py-0.5 text-[9px] font-extrabold text-slate-500 uppercase border border-slate-300 bg-white rounded-md tracking-wider shrink-0 select-none">
                  HRD Corp
                </span>
              )}
            </h3>
          </Link>
        </div>

        {/* Duration/Location & Price */}
        <div className="mt-4 flex items-end justify-between gap-4">
          {/* Duration & Location (Stacked) */}
          <div className="flex flex-col gap-1 text-[11px] font-bold text-slate-450 font-sans leading-tight">
            {program.duration && (
              <span>{program.duration}</span>
            )}
            <span className="line-clamp-2">{program.location}</span>
          </div>

          {/* Price */}
          <div className="text-right flex flex-col justify-end shrink-0">
            <span className="text-lg font-black text-slate-900 leading-none">
              {parsedPrice.main}
            </span>
            {parsedPrice.sub && (
              <span className="text-[9px] font-extrabold text-slate-400 mt-1 block uppercase tracking-wider font-sans">
                {parsedPrice.sub}
              </span>
            )}
          </div>
        </div>

        {/* Divider Line */}
        <div className="mt-5 border-t border-slate-100 w-full" />

        {/* Next Intake & Clickable Arrow */}
        <div className="mt-4 flex items-center justify-between">
          {/* Next Intake */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span className="text-slate-400 font-medium">Next Intake:</span>
            <span className="text-slate-800">{program.dates || "Scheduled Soon"}</span>
          </div>

          {/* Clickable Arrow with Spring Effect */}
          <Link href={`/programs/${program.slug}`} aria-label={`View syllabus for ${program.title}`}>
            <ArrowRight className="h-5 w-5 text-slate-900 spring-arrow transition-colors hover:text-primary cursor-pointer" />
          </Link>
        </div>
        
      </div>
    </div>
  );
}
