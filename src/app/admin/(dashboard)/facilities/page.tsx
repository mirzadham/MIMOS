import { getSafeFacilities } from "@/lib/db";
import ManageFacilitiesClient from "@/components/admin/ManageFacilitiesClient";

export const dynamic = "force-dynamic";

export default async function AdminFacilitiesPage() {
  const facilities = await getSafeFacilities();

  const typedFacilities = facilities.map((f) => ({
    id: f.id,
    index: f.index,
    title: f.title,
    subtitle: f.subtitle,
    imageUrl: f.imageUrl || null,
    desc: f.desc,
    specs: f.specs,
    order: f.order,
  }));

  return (
    <ManageFacilitiesClient facilities={typedFacilities} />
  );
}
