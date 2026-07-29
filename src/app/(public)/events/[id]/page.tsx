import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSafeEventById } from "@/lib/db";
import EventDetailClient from "./EventDetailClient";

export const dynamic = "force-dynamic";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const event = await getSafeEventById(id);

  if (!event) {
    return {
      title: "Event Not Found | MIMOS Academy",
    };
  }

  return {
    title: `${event.title} | MIMOS Academy Events`,
    description: event.description || `Register for ${event.title} at MIMOS Academy.`,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getSafeEventById(id);

  if (!event) {
    notFound();
  }

  return <EventDetailClient event={event} />;
}
