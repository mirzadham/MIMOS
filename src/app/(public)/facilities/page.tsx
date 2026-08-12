import { getSafeFacilities } from "@/lib/db";
import ContentUnavailableNotice from "@/components/ui/ContentUnavailableNotice";
import FacilitiesClientPage from "./FacilitiesClientPage";

export const dynamic = "force-dynamic";

export default async function FacilitiesPage() {
  const facilities = await getSafeFacilities();
  const unavailable = facilities === null;

  return (
    <>
      {unavailable && (
        <div className="pt-28 sm:pt-36">
          <ContentUnavailableNotice />
        </div>
      )}
      <FacilitiesClientPage facilities={facilities ?? []} />
    </>
  );
}
