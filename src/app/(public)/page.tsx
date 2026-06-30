export const dynamic = "force-dynamic";

import HeroSection from "@/components/landing/HeroSection";
import UpcomingSection from "@/components/landing/UpcomingSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import FeaturedPrograms from "@/components/landing/FeaturedPrograms";
import Testimonials from "@/components/landing/Testimonials";
import Partners from "@/components/landing/Partners";
import StatsSection from "@/components/landing/StatsSection";
import StatsAndFacilities from "@/components/landing/StatsAndFacilities";
import { getSafePrograms, getSafeStats, getSafePartners, getSafeWhyChooseUsCards } from "@/lib/db";

export default async function Home() {
  const [programs, stats, partners, whyChooseUsCards] = await Promise.all([
    getSafePrograms(),
    getSafeStats(),
    getSafePartners(),
    getSafeWhyChooseUsCards()
  ]);

  return (
    <div className="relative bg-background min-h-screen">
      
      {/* 1. Hero Section (Client component with canvas background) */}
      <HeroSection />

      {/* 2. Stats Row (Horizontal, animated count-up) */}
      <StatsSection stats={stats} />

      {/* 3. Partners Marquee (Right-to-left infinite scroll) */}
      <Partners partners={partners} />

      {/* 4. Why Choose Us? Section (Bento Grid Advantage) */}
      <WhyChooseUs cards={whyChooseUsCards} />

      {/* 5. Upcoming Trainings & Events Section */}
      <UpcomingSection />

      {/* 6. Featured Programmes Section */}
      <section id="featured-programs">
        <FeaturedPrograms programs={programs} />
      </section>

      {/* 7. Testimonials (Alumni Reviews) Section */}
      <Testimonials />

      {/* 8. Our Facilities Section */}
      <StatsAndFacilities />

    </div>
  );
}


