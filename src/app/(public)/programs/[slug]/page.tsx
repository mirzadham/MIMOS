export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getSafeProgramBySlug } from "@/lib/db";
import { Clock, MapPin, BadgeDollarSign, ArrowLeft, Send, Sparkles, Building } from "lucide-react";

interface ProgramPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProgramDetailPage({ params }: ProgramPageProps) {
  const { slug } = await params;
  const program = await getSafeProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  // Quick helper to render custom markdown modules in syllabus as HTML lists
  const formatSyllabus = (text: string) => {
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("###")) {
        return (
          <h3 key={idx} className="font-heading text-lg font-bold text-foreground mt-6 mb-3">
            {trimmed.replace("###", "")}
          </h3>
        );
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        return (
          <li key={idx} className="text-sm text-slate-600 ml-4 list-disc pl-1 leading-relaxed mt-1">
            {trimmed.substring(1).trim()}
          </li>
        );
      }
      if (/^\d+\./.test(trimmed)) {
        // Highlight module header bold text
        const titleMatch = trimmed.match(/^\d+\.\s+\*\*(.*?)\*\*(.*)/);
        if (titleMatch) {
          return (
            <div key={idx} className="mt-4 border-l-2 border-primary pl-3 py-0.5">
              <span className="text-sm font-bold text-foreground block">
                {titleMatch[1]}
              </span>
              <span className="text-xs text-slate-500 block mt-0.5">
                {titleMatch[2].replace(/[()]/g, "").trim()}
              </span>
            </div>
          );
        }
        return (
          <p key={idx} className="text-sm text-slate-600 mt-2 font-medium">
            {trimmed}
          </p>
        );
      }
      return trimmed ? (
        <p key={idx} className="text-sm text-slate-600 mt-2 leading-relaxed">
          {trimmed}
        </p>
      ) : null;
    });
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/#programs-catalog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Catalog</span>
        </Link>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          
          {/* Left Column: Syllabus & Program details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Header Block */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-4 overflow-hidden">
              {program.imageUrl && (
                <div className="w-full aspect-[21/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-6">
                  <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover" />
                </div>
              )}
              <span className="inline-flex items-center rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-primary">
                {program.category?.name || "Physical Training"}
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                {program.title}
              </h1>
              <p className="text-sm sm:text-md text-slate-500 leading-relaxed font-body">
                {program.description}
              </p>
            </div>

            {/* Syllabus breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                <Sparkles className="h-5 w-5 text-slate-500" />
                <h2 className="font-heading text-lg font-bold text-foreground">Course Syllabus</h2>
              </div>
              <div className="space-y-1 font-body">
                {formatSyllabus(program.syllabus)}
              </div>
            </div>

            {/* Laboratory Location specs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
                <Building className="h-5 w-5 text-slate-500" />
                <h2 className="font-heading text-lg font-bold text-foreground">Training Venue Details</h2>
              </div>
              <div className="space-y-4 font-body">
                <p className="text-sm text-slate-600 leading-relaxed">
                  This course is conducted physically inside our state-of-the-art research laboratories. Attendees will gain direct hands-on access to advanced machinery, monitoring environments, and dedicated testing frameworks under professional supervision.
                </p>
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">Lab Location:</span>
                    <span className="text-xs text-slate-500 block mt-0.5">{program.location}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky actions block */}
          <div className="space-y-6 lg:sticky lg:top-24">
            
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              
              <h3 className="font-heading text-sm font-bold tracking-wider text-foreground uppercase border-b border-slate-100 pb-3">
                Course Specifications
              </h3>

              {/* Price */}
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                  <BadgeDollarSign className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Course Fee</span>
                  <span className="text-sm font-bold text-foreground block">{program.price || "Free"}</span>
                </div>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Course Duration</span>
                  <span className="text-sm font-bold text-foreground block">{program.duration || "N/A"}</span>
                </div>
              </div>

              {/* Venue Icon Row */}
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Conduct Method</span>
                  <span className="text-sm font-bold text-foreground block">Physical (Classroom & Lab)</span>
                </div>
              </div>

              {/* Upcoming Batch Schedule */}
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Next Active Batch</span>
                <span className="text-sm font-extrabold text-slate-800 block mt-1">{program.dates || "Scheduled Soon"}</span>
                <span className="text-[10px] text-slate-400 block mt-1 leading-normal">Registration closing 7 days prior to start date.</span>
              </div>

              {/* Apply Redirection Button */}
              <a
                href={program.microsoftFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white py-3.5 text-sm font-bold transition-all hover:shadow-md cursor-pointer"
              >
                <span>Register Interest</span>
                <Send className="h-4 w-4" />
              </a>

              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-medium">
                  Redirects to Microsoft Forms for sign-up questions.
                </span>
              </div>

            </div>

            {/* B2B request notice inside sticky column */}
            <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-6 space-y-4">
              <h4 className="font-heading text-sm font-bold">Request Private Cohort?</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-body">
                We can customize this course structure and run private physical labs for your company&apos;s employees.
              </p>
              <Link
                href="/contact"
                className="text-xs font-bold text-primary hover:text-primary-hover transition-colors inline-block"
              >
                Contact B2B Coordination →
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
