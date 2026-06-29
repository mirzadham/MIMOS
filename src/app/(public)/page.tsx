export const dynamic = "force-dynamic";

import HeroSection from "@/components/landing/HeroSection";
import UpcomingSection from "@/components/landing/UpcomingSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import FeaturedPrograms from "@/components/landing/FeaturedPrograms";
import Testimonials from "@/components/landing/Testimonials";
import Partners from "@/components/landing/Partners";
import StatsAndFacilities from "@/components/landing/StatsAndFacilities";
import { getSafePrograms } from "@/lib/db";

export default async function Home() {
  const programs = await getSafePrograms();

  return (
    <div className="relative bg-white min-h-screen">
      
      {/* 1. Hero Section (Client component with canvas background) */}
      <HeroSection />

      {/* 2. Upcoming Trainings & Events Section */}
      <UpcomingSection />

      {/* 3. Why Choose Us? Section (Bento Grid Advantage) */}
      <WhyChooseUs />

      {/* 4. Featured Programmes Section */}
      <section id="featured-programs">
        <FeaturedPrograms programs={programs} />
      </section>

      {/* 5. Testimonials (Alumni Reviews) Section */}
      <Testimonials />

      {/* 6. Our Partners Section */}
      <Partners />

      {/* 7. Our Facilities & Statistics Section */}
      <StatsAndFacilities />

    </div>
  );
}
