import type { Facility, FacilityType } from "@prisma/client";

/** Facilities eligible for the homepage "Our Facilities" showcase. */
export type FeaturedFacility = Pick<
  Facility,
  "id" | "title" | "imageUrl" | "featured" | "order" | "type"
>;

/** The homepage showcase is a fixed two-slot layout: Lab (left) and Training Room (right). */
export const SHOWCASE_SLOT_LABELS: Record<FacilityType, string> = {
  LAB: "Lab",
  TRAINING_ROOM: "Training Room",
};

export interface ShowcaseSelection {
  lab: FeaturedFacility | null;
  trainingRoom: FeaturedFacility | null;
}

/**
 * Selects the facilities for the homepage showcase: the featured facility of
 * each type, prioritized by display order — one Lab for the left pane and one
 * Training Room for the right pane. Returns null per slot when none are
 * featured, so the caller can fall back. Never mutates the input.
 */
export function selectShowcaseFacilities(
  facilities: FeaturedFacility[]
): ShowcaseSelection {
  const featured = [...facilities]
    .filter((f) => f.featured)
    .sort((a, b) => a.order - b.order);

  return {
    lab: featured.find((f) => f.type === "LAB") ?? null,
    trainingRoom: featured.find((f) => f.type === "TRAINING_ROOM") ?? null,
  };
}
