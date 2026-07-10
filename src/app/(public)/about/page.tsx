import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSafeAboutSettings, getSafeTeamMembers } from "@/lib/db";
import TeamMemberCardClient from "@/components/about/TeamMemberCardClient";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const [settings, teamMembers] = await Promise.all([
    getSafeAboutSettings(),
    getSafeTeamMembers()
  ]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background pt-28 pb-16 sm:pt-36 sm:pb-24">
      {/* Delicate background ambient highlights */}
      <div className="absolute right-0 top-0 -z-10 h-96 w-96 bg-primary/3 blur-[120px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/3 -z-10 h-96 w-96 bg-primary/2 blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-24">

        {/* 1. HERO SECTION (Editorial, Large Typography) */}
        <section className="space-y-10">
          <div className="max-w-4xl space-y-3">
            <h1 className="font-heading text-4xl font-semibold text-slate-900 sm:text-6xl tracking-tight leading-[1.1]">
              Architecting Malaysia&apos;s Strategic Technology Talent.
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-10 border-t border-slate-200 pt-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="font-heading text-2xl font-semibold text-slate-900 tracking-tight leading-snug">
                MIMOS Academy bridges the critical gap between academic theory, deep-tech research, and real industry demands.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-6 text-slate-600 font-body text-sm md:text-base leading-relaxed">
              <p>
                MIMOS Academy is a strategic capability development and technology solutions organisation that develops future-ready talent while supporting digital transformation and innovation initiatives. 
              </p>
              <p>
                Leveraging MIMOS&apos; R&D heritage and ecosystem, the Academy delivers professional development programmes, technology consultancy, project management, and talent solutions across key sectors.
              </p>
            </div>
          </div>
        </section>

        {/* 4. MISSION & VISION (Full-Width Magazine Style with Giant Quotes) */}
        <section className="space-y-20">
          {/* Mission */}
          <div className="border-t border-slate-200 pt-16">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-6">
              OUR MISSION
            </span>
            <div className="relative max-w-5xl">
              <span className="absolute -left-4 -top-8 text-[120px] font-heading font-semibold text-primary/5 leading-none select-none">
                “
              </span>
              <p className="font-heading text-2xl font-semibold text-slate-900 md:text-4xl lg:text-5xl tracking-tight leading-tight relative z-10 pl-6 border-l-2 border-primary/20">
                {settings.mission}
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="border-t border-slate-200 pt-16">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-6">
              OUR VISION
            </span>
            <div className="relative max-w-5xl">
              <span className="absolute -left-4 -top-8 text-[120px] font-heading font-semibold text-primary/5 leading-none select-none">
                “
              </span>
              <p className="font-heading text-2xl font-semibold text-slate-900 md:text-4xl lg:text-5xl tracking-tight leading-tight relative z-10 pl-6 border-l-2 border-primary/20">
                {settings.vision}
              </p>
            </div>
          </div>
        </section>

        {/* 5. TEAM DIRECTORY (Simple 4-column Grid matching the Reference Design) */}
        <section className="space-y-12 border-t border-slate-200 pt-20">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-semibold text-slate-900 tracking-tight sm:text-4xl">
              Leadership Team
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-12">
            {teamMembers.map((member: { id: string; name: string; role: string; imageUrl: string | null; initials: string }) => (
              <TeamMemberCardClient key={member.id} member={member} />
            ))}
          </div>
        </section>

        {/* 6. DOUBLE CTA SECTION (Enterprise B2B / Talent B2C) */}
        <section className="border-t border-slate-200 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-accent/30 border border-primary/5 p-8 sm:p-16 rounded-2xl relative overflow-hidden">
            {/* Ambient subtle glow for CTA */}
            <div className="absolute right-0 top-0 -z-10 h-64 w-64 bg-primary/2 blur-[80px]" />

            {/* Column 1: B2B Enterprise */}
            <div className="flex flex-col justify-between space-y-8 pr-0 lg:pr-8 border-b border-slate-200 lg:border-b-0 lg:border-r border-slate-200 pb-12 lg:pb-0">
              <div className="space-y-4">
                <span className="text-[10px] font-semibold text-primary uppercase tracking-widest block">
                  PARTNERSHIP
                </span>
                <h3 className="font-heading text-2xl font-semibold text-slate-900 tracking-tight sm:text-3xl">
                  Enterprise Capability Development
                </h3>
                <p className="font-body text-sm text-slate-650 leading-relaxed max-w-md">
                  Leverage MIMOS Academy’s expertise to build specialized technical curricula and advanced training programs tailored to your organization’s diverse workforce requirements across all sectors.
                </p>
              </div>
              <div className="pt-2">
                <Link 
                  href="/contact" 
                  className={cn(buttonVariants({ variant: "default" }), "cursor-pointer group gap-2 h-10 px-5 rounded-lg text-xs font-semibold")}
                >
                  Contact Us
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

            {/* Column 2: B2C Tech Talent */}
            <div className="flex flex-col justify-between space-y-8 pl-0 lg:pl-8">
              <div className="space-y-4">
                <span className="text-[10px] font-semibold text-primary uppercase tracking-widest block">
                  UPSKILLING
                </span>
                <h3 className="font-heading text-2xl font-semibold text-slate-900 tracking-tight sm:text-3xl">
                  Elevate Your Professional Career
                </h3>
                <p className="font-body text-sm text-slate-650 leading-relaxed max-w-md">
                  Transform your skill set with high-impact technical programs designed for today’s demands. Benefit from hands-on learning in specialized environments led by our expert trainers.
                </p>
              </div>
              <div className="pt-2">
                <Link 
                  href="/programs" 
                  className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer group gap-2 h-10 px-5 rounded-lg text-xs font-semibold border-slate-300 hover:border-primary")}
                >
                  Explore Programs
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
