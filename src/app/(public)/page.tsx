export const dynamic = "force-dynamic";

import HeroSection from "@/components/landing/HeroSection";
import UpcomingSection from "@/components/landing/UpcomingSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import UpcomingEvents from "@/components/landing/UpcomingEvents";
import FeaturedPrograms from "@/components/landing/FeaturedPrograms";
import Testimonials from "@/components/landing/Testimonials";
import Partners from "@/components/landing/Partners";
import StatsSection from "@/components/landing/StatsSection";
import StatsAndFacilities from "@/components/landing/StatsAndFacilities";
import ContentUnavailableNotice from "@/components/ui/ContentUnavailableNotice";
import { getSafePrograms, getSafeStats, getSafePartners, getSafeWhyChooseUsCards, getSafeTestimonials, getSafeNewsArticles, getSafeUpcomingEvents } from "@/lib/db";

export default async function Home() {
  const [programs, stats, partners, whyChooseUsCards, testimonials, newsArticles, upcomingEvents] = await Promise.all([
    getSafePrograms(),
    getSafeStats(),
    getSafePartners(),
    getSafeWhyChooseUsCards(),
    getSafeTestimonials(),
    getSafeNewsArticles(),
    getSafeUpcomingEvents()
  ]);

  const unavailable =
    programs === null ||
    stats === null ||
    partners === null ||
    whyChooseUsCards === null ||
    testimonials === null ||
    newsArticles === null ||
    upcomingEvents === null;

  return (
    <div className="relative bg-background min-h-screen">
      
      {/* 1. Hero Section (Client component with canvas background) */}
      <HeroSection />

      {unavailable && (
        <div className="pt-6">
          <ContentUnavailableNotice />
        </div>
      )}

      {/* 2. Stats Row (Horizontal, animated count-up) */}
      <StatsSection stats={stats ?? []} />

      {/* 3. Partners Marquee (Right-to-left infinite scroll) */}
      <Partners partners={partners ?? []} />

      {/* 4. Why Choose Us? Section (Bento Grid Advantage) */}
      <WhyChooseUs cards={whyChooseUsCards ?? []} />

      {/* 5. Upcoming Events Section */}
      <UpcomingEvents events={upcomingEvents ?? []} />

      {/* 6. Upcoming Trainings & News Section */}
      <UpcomingSection articles={newsArticles ?? []} />

      {/* 6. Featured Programmes Section */}
      <section id="featured-programs">
        <FeaturedPrograms programs={programs ?? []} />
      </section>

      {/* 7. Our Facilities Section */}
      <StatsAndFacilities />

      {/* 8. Testimonials (Alumni Reviews) Section */}
      <Testimonials testimonials={testimonials ?? []} />

    </div>
  );
}


