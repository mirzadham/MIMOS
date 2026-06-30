import { getSafePartners } from "@/lib/db";
import ManagePartnersClient from "@/components/admin/ManagePartnersClient";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const partners = await getSafePartners();

  const typedPartners = partners.map(p => ({
    id: p.id,
    name: p.name,
    logoUrl: p.logoUrl
  }));

  return (
    <ManagePartnersClient partners={typedPartners} />
  );
}
