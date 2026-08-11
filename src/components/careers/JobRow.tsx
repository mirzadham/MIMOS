import React from "react";
import { ArrowUpRight, MapPin, Clock } from "lucide-react";
import { JobListing } from "@/data/careersData";

interface JobRowProps {
  job: JobListing;
}

export default function JobRow({ job }: JobRowProps) {
  return (
    <article className="group py-7 border-t border-slate-200 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        {/* Left Side: Job details */}
        <div className="flex-1 space-y-2.5">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-primary transition-colors">
            {job.title}
          </h3>

          <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed">
            {job.description}
          </p>

          {/* Small rounded tags */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-50/60 px-3 py-1 text-xs font-medium text-slate-700">
              <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" aria-hidden="true" />
              {job.location}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-50/60 px-3 py-1 text-xs font-medium text-slate-700">
              <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" aria-hidden="true" />
              {job.employmentType}
            </span>
          </div>
        </div>

        {/* Right Side: Apply Link */}
        <div className="pt-2 md:pt-0 shrink-0">
          <a
            href={job.applyUrl || "#"}
            aria-label={`Apply for ${job.title}`}
            className="inline-flex items-center gap-1.5 text-base sm:text-lg font-semibold text-slate-900 hover:text-primary transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-900"
          >
            <span>Apply</span>
            <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
