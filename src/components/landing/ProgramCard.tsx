import Link from "next/link";
import { Clock, MapPin, ArrowRight, Award } from "lucide-react";

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
  };
}

export default function ProgramCard({ program }: ProgramCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
      
      {/* Top Banner Image */}
      {program.imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
          <img
            src={program.imageUrl}
            alt={program.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
          />
        </div>
      ) : (
        <div className="relative h-10 w-full bg-gradient-to-r from-slate-50 to-slate-100/30 border-b border-slate-100" />
      )}

      {/* Card body container */}
      <div className="flex-1 flex flex-col justify-between p-6">
        {/* Category Tag & Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700">
            {program.category?.name || "Upskilling Program"}
          </span>
          {program.price?.includes("HRD Corp") && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              <Award className="h-3 w-3 text-slate-500" />
              HRD Corp
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="mt-4 flex-1">
          <h3 className="font-heading text-lg font-bold text-slate-900 transition-colors leading-snug group-hover:text-primary">
            {program.title}
          </h3>
          <p className="mt-2 text-sm text-slate-500 line-clamp-3 leading-relaxed">
            {program.description}
          </p>
        </div>

        {/* Meta Specs */}
        <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col gap-2 text-xs text-slate-500">
          {program.duration && (
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{program.duration}</span>
            </div>
          )}
          <div className="flex items-start gap-2">
            <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{program.location}</span>
          </div>
        </div>

        {/* Link Action */}
        <div className="mt-6">
          <Link
            href={`/programs/${program.slug}`}
            className="inline-flex items-center justify-center gap-1.5 text-sm font-bold text-primary hover:text-primary-hover transition-all hover:gap-2.5"
          >
            <span>View Syllabus & Apply</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Top Brand Accent Border */}
      <div className="absolute top-0 left-0 h-[3px] w-0 bg-primary transition-all duration-300 group-hover:w-full" />
    </div>
  );
}
