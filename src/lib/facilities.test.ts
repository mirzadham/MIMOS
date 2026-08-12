import { describe, expect, it } from "vitest";
import {
  MAX_FEATURED_FACILITIES,
  selectFeaturedFacilities,
  type FeaturedFacility,
} from "./facilities";

function fac(overrides: Partial<FeaturedFacility> = {}): FeaturedFacility {
  return {
    id: "f1",
    title: "Facility",
    imageUrl: null,
    featured: true,
    order: 0,
    ...overrides,
  };
}

describe("selectFeaturedFacilities", () => {
  it("returns only featured facilities", () => {
    const input = [
      fac({ id: "a", featured: false }),
      fac({ id: "b", featured: true }),
      fac({ id: "c", featured: false }),
    ];
    expect(selectFeaturedFacilities(input).map((f) => f.id)).toEqual(["b"]);
  });

  it("orders by display order ascending and caps at the layout limit", () => {
    const input = [
      fac({ id: "a", order: 3 }),
      fac({ id: "b", order: 0 }),
      fac({ id: "c", order: 1 }),
    ];
    expect(selectFeaturedFacilities(input).map((f) => f.id)).toEqual(["b", "c"]);
  });

  it(`caps at ${MAX_FEATURED_FACILITIES} facilities`, () => {
    const input = [0, 1, 2, 3].map((order) => fac({ id: `f${order}`, order }));
    const result = selectFeaturedFacilities(input);
    expect(result).toHaveLength(MAX_FEATURED_FACILITIES);
    expect(result.map((f) => f.id)).toEqual(["f0", "f1"]);
  });

  it("returns an empty array when nothing is featured", () => {
    const input = [fac({ id: "a", featured: false }), fac({ id: "b", featured: false })];
    expect(selectFeaturedFacilities(input)).toEqual([]);
  });

  it("returns an empty array for empty input", () => {
    expect(selectFeaturedFacilities([])).toEqual([]);
  });

  it("does not mutate the input array or its order", () => {
    const input = [
      fac({ id: "a", order: 2 }),
      fac({ id: "b", order: 0 }),
      fac({ id: "c", order: 1 }),
    ];
    const snapshot = input.map((f) => f.id);
    selectFeaturedFacilities(input);
    expect(input.map((f) => f.id)).toEqual(snapshot);
    expect(input[0].order).toBe(2);
  });
});
