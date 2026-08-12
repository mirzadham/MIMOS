import { Metadata } from "next";
import { getSafeUpcomingEvents } from "@/lib/db";
import ContentUnavailableNotice from "@/components/ui/ContentUnavailableNotice";
import EventsPageClient from "./EventsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Upcoming & Past Events | MIMOS Academy",
  description: "Browse upcoming microelectronics seminars, cleanroom lab visits, specialized workshops, and technical trainings at MIMOS Academy.",
};

export default async function EventsPage() {
  const events = await getSafeUpcomingEvents();
  const unavailable = events === null;

  return (
    <>
      {unavailable && (
        <div className="pt-28 sm:pt-36">
          <ContentUnavailableNotice />
        </div>
      )}
      <EventsPageClient events={events ?? []} />
    </>
  );
}
