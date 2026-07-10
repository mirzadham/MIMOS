import { getSafeFacilities } from "@/lib/db";
import FacilitiesClientPage from "./FacilitiesClientPage";

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
  const facilities = await getSafeFacilities();

  return (
    <FacilitiesClientPage facilities={facilities} />
  );
}
