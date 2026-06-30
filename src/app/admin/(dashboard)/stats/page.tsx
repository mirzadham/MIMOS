import { getSafeStats } from "@/lib/db";
import ManageStatsClient from "@/components/admin/ManageStatsClient";

export const dynamic = "force-dynamic";

export default async function AdminStatsPage() {
  const stats = await getSafeStats();

  const typedStats = stats.map(s => ({
    id: s.id,
    number: s.number,
    label: s.label
  }));

  return (
    <ManageStatsClient stats={typedStats} />
  );
}
