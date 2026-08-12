import type { Facility } from "@prisma/client";

/** Facilities eligible for the homepage "Our Facilities" showcase. */
export type FeaturedFacility = Pick<
  Facility,
  "id" | "title" | "imageUrl" | "featured" | "order"
>;

/** The homepage split-pane layout supports exactly this many showcase panes. */
export const MAX_FEATURED_FACILITIES = 2;

/**
 * Selects the facilities to showcase on the homepage: featured only, ordered by
 * display order, capped at MAX_FEATURED_FACILITIES. Returns an empty array when
 * none are featured — the caller decides the fallback. Never mutates the input.
 */
export function selectFeaturedFacilities(
  facilities: FeaturedFacility[]
): FeaturedFacility[] {
  return [...facilities]
    .filter((f) => f.featured)
    .sort((a, b) => a.order - b.order)
    .slice(0, MAX_FEATURED_FACILITIES);
}
