import { describe, expect, it } from "vitest";
import {
  selectShowcaseFacilities,
  SHOWCASE_SLOT_LABELS,
  type FeaturedFacility,
} from "./facilities";

function fac(overrides: Partial<FeaturedFacility> = {}): FeaturedFacility {
  return {
    id: "f1",
    title: "Facility",
    imageUrl: null,
    featured: true,
    order: 0,
    type: "LAB",
    ...overrides,
  };
}

describe("selectShowcaseFacilities", () => {
  it("picks one featured lab and one featured training room", () => {
    const input = [
      fac({ id: "lab", type: "LAB" }),
      fac({ id: "room", type: "TRAINING_ROOM" }),
      fac({ id: "unfeatured-lab", type: "LAB", featured: false }),
    ];
    const result = selectShowcaseFacilities(input);
    expect(result.lab?.id).toBe("lab");
    expect(result.trainingRoom?.id).toBe("room");
  });

  it("prioritizes by display order within each type", () => {
    const input = [
      fac({ id: "lab2", type: "LAB", order: 2 }),
      fac({ id: "lab1", type: "LAB", order: 0 }),
      fac({ id: "room1", type: "TRAINING_ROOM", order: 5 }),
    ];
    const result = selectShowcaseFacilities(input);
    expect(result.lab?.id).toBe("lab1");
    expect(result.trainingRoom?.id).toBe("room1");
  });

  it("ignores facilities that are not featured", () => {
    const input = [
      fac({ id: "lab", type: "LAB", featured: false }),
      fac({ id: "room", type: "TRAINING_ROOM", featured: false }),
    ];
    expect(selectShowcaseFacilities(input)).toEqual({
      lab: null,
      trainingRoom: null,
    });
  });

  it("returns null per slot when that type has no featured facility", () => {
    const input = [fac({ id: "lab", type: "LAB" })];
    const result = selectShowcaseFacilities(input);
    expect(result.lab?.id).toBe("lab");
    expect(result.trainingRoom).toBeNull();
  });

  it("returns null slots for empty input", () => {
    expect(selectShowcaseFacilities([])).toEqual({
      lab: null,
      trainingRoom: null,
    });
  });

  it("does not mutate the input array or its order", () => {
    const input = [
      fac({ id: "a", order: 2 }),
      fac({ id: "b", order: 0 }),
      fac({ id: "c", type: "TRAINING_ROOM", order: 1 }),
    ];
    const snapshot = input.map((f) => f.id);
    selectShowcaseFacilities(input);
    expect(input.map((f) => f.id)).toEqual(snapshot);
    expect(input[0].order).toBe(2);
  });

  it("exposes fixed human labels for both slots", () => {
    expect(SHOWCASE_SLOT_LABELS.LAB).toBe("Lab");
    expect(SHOWCASE_SLOT_LABELS.TRAINING_ROOM).toBe("Training Room");
  });
});
