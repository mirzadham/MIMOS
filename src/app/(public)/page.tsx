export const dynamic = "force-dynamic";

import Link from "next/link";
import LatticeNetwork from "@/components/landing/LatticeNetwork";
import FeaturedPrograms from "@/components/landing/FeaturedPrograms";
import UpcomingSection from "@/components/landing/UpcomingSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import Testimonials from "@/components/landing/Testimonials";
import Partners from "@/components/landing/Partners";
import StatsAndFacilities from "@/components/landing/StatsAndFacilities";
import { getSafeCategories, getSafePrograms } from "@/lib/db";
import { Cpu } from "lucide-react";

export default async function Home() {
  const [categories, programs] = await Promise.all([
    getSafeCategories(),
    getSafePrograms()
  ]);

  return (
    <div className="relative">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 py-24 sm:py-32 bg-slate-50">
        <LatticeNetwork />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-primary border border-primary/10">
            <Cpu className="h-3.5 w-3.5" />
            <span>Trusted by 150K+ people around Malaysia</span>
          </div>

          <h1 className="mx-auto max-w-4xl font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl leading-tight">
            Driving Malaysia’s <span className="text-primary">High-Tech Excellence</span> In Talent
          </h1>

          <p className="mx-auto max-w-2xl text-md sm:text-lg text-slate-500 leading-relaxed font-body">
            Empowering talent for Malaysia’s high-tech future — bridging education and industry for a ready workforce.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/programs"
              className="rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white hover:bg-primary/95 transition-all hover:shadow-md"
            >
              Explore Our Programmes
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Contact Advisory Team
            </Link>
          </div>
        </div>

        {/* Diagonal Gradient Border Detail */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </section>

      {/* 2. Upcoming Trainings & Events Section */}
      <UpcomingSection />

      {/* 3. Why Choose Us? Section */}
      <WhyChooseUs />

      {/* 4. Our Programmes (Featured Programs) Section */}
      <section id="featured-programs">
        <FeaturedPrograms programs={programs} />
      </section>

      {/* 5. Testimonials (What People Said About Us) Section */}
      <Testimonials />

      {/* 6. Our Partners Section */}
      <Partners />

      {/* 7. Our Facilities & Statistics Section */}
      <StatsAndFacilities />

    </div>
  );
}

