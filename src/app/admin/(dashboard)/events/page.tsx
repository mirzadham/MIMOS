import React from "react";
import { getSafeUpcomingEvents } from "@/lib/db";
import AdminEventsClient from "./AdminEventsClient";

export const metadata = {
  title: "Manage Events | MIMOS Admin Portal",
};

export default async function AdminEventsPage() {
  const events = await getSafeUpcomingEvents();

  return <AdminEventsClient initialEvents={events} />;
}
