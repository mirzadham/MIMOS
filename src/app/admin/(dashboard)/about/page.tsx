import { getSafeAboutSettings, getSafeTeamMembers } from "@/lib/db";
import ManageAboutClient from "@/components/admin/ManageAboutClient";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const [settings, teamMembers] = await Promise.all([
    getSafeAboutSettings(),
    getSafeTeamMembers()
  ]);

  return (
    <ManageAboutClient 
      initialSettings={settings} 
      initialTeam={teamMembers} 
    />
  );
}
