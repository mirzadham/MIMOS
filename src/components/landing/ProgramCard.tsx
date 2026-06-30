import Link from "next/link";
import { Clock, MapPin, ArrowRight, Award, GraduationCap } from "lucide-react";

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
  };
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const displayImageUrl = (program.imageUrls && program.imageUrls.length > 0)
    ? program.imageUrls[0]
    : program.imageUrl;

  const isHrdCorp = program.price?.toLowerCase().includes("hrd corp") || false;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-none border border-slate-200 bg-white p-0 transition-all duration-300 hover:border-primary">
      
      {/* Top Banner Image / Placeholder */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-200">
        {displayImageUrl ? (
          <img
            src={displayImageUrl}
            alt={program.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-50/50">
            <GraduationCap className="h-10 w-10 text-slate-300 transition-transform duration-500 group-hover:scale-105" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 via-transparent to-transparent" />
        
        {/* Floating Category Tag */}
        <span className="absolute left-4 top-4 inline-flex items-center rounded-none bg-white px-2.5 py-1 text-[10px] font-bold text-slate-800 border border-slate-200 shadow-sm">
          {program.category?.name || "Upskilling"}
        </span>
      </div>

      {/* Card body container */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-7 bg-white">
        
        {/* Price / Accreditation status */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold font-mono text-primary bg-primary/5 px-2 py-0.5 rounded-none border border-primary/20">
            {program.price ? program.price.split("(")[0].trim() : "Advisory Intake"}
          </span>
          {isHrdCorp && (
            <span className="inline-flex items-center gap-1 rounded-none bg-slate-50 border border-slate-200 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase tracking-wide">
              <Award className="h-3 w-3 text-slate-400 shrink-0" />
              HRD Corp
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="mt-4 flex-1">
          <h3 className="font-heading text-lg font-bold text-slate-900 tracking-tight transition-colors duration-200 leading-snug group-hover:text-primary">
            {program.title}
          </h3>
          <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed font-body">
            {program.description}
          </p>
        </div>

        {/* Meta Specs */}
        <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col gap-2.5 text-xs font-semibold text-slate-500">
          {program.duration && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{program.duration}</span>
            </div>
          )}
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{program.location}</span>
          </div>
        </div>

        {/* Link Action */}
        <div className="mt-6 pt-1">
          <Link
            href={`/programs/${program.slug}`}
            className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-800 group-hover:text-primary transition-all duration-200"
          >
            <span>View Syllabus & Apply</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
