/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from "vitest";
import {
  dbEventToUpcomingEvent,
  sanitizeEventCategory,
  sanitizeEventAgenda,
  EVENT_CATEGORIES,
} from "./db";

describe("dbEventToUpcomingEvent", () => {
  it("maps all fields from a DB row", () => {
    const row = {
      id: "evt-9",
      date: "JAN 01",
      rawDate: "2027-01-01",
      title: "Test Event",
      category: "WORKSHOP",
      isPast: false,
      location: "MIMOS Berhad, Bukit Jalil",
      description: "A description",
      imageUrl: "https://assets.example.r2.dev/img.png",
      microsoftFormUrl: "https://forms.office.com/r/abc",
      agenda: [{ time: "09:00 AM", topic: "Intro" }],
      link: "/programs/some-program",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const evt = dbEventToUpcomingEvent(row as any);

    expect(evt).toEqual({
      id: "evt-9",
      date: "JAN 01",
      rawDate: "2027-01-01",
      title: "Test Event",
      category: "WORKSHOP",
      isPast: false,
      location: "MIMOS Berhad, Bukit Jalil",
      description: "A description",
      imageUrl: "https://assets.example.r2.dev/img.png",
      microsoftFormUrl: "https://forms.office.com/r/abc",
      agenda: [{ time: "09:00 AM", topic: "Intro" }],
      link: "/programs/some-program",
    });
  });

  it("sanitizes null/empty DB values into safe defaults", () => {
    const row = {
      id: "evt-10",
      date: "TBD",
      title: "Minimal",
      category: "BOGUS",
      isPast: true,
      rawDate: null,
      location: null,
      description: "",
      imageUrl: null,
      microsoftFormUrl: null,
      agenda: null,
      link: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const evt = dbEventToUpcomingEvent(row as any);

    expect(evt.category).toBe("SEMINAR"); // invalid category sanitized
    expect(evt.description).toBe(""); // DB default empty string passes through
    expect(evt.agenda).toEqual([]); // null agenda → []
    expect(evt.rawDate).toBeUndefined();
    expect(evt.location).toBeUndefined();
    expect(evt.link).toBeUndefined();
  });
});

describe("sanitizeEventCategory", () => {
  it("keeps valid categories unchanged", () => {
    for (const c of EVENT_CATEGORIES) {
      expect(sanitizeEventCategory(c)).toBe(c);
    }
  });

  it("falls back to SEMINAR for invalid values", () => {
    expect(sanitizeEventCategory("BOGUS")).toBe("SEMINAR");
    expect(sanitizeEventCategory("")).toBe("SEMINAR");
    expect(sanitizeEventCategory(null)).toBe("SEMINAR");
    expect(sanitizeEventCategory(undefined)).toBe("SEMINAR");
  });
});

describe("sanitizeEventAgenda", () => {
  it("passes through well-formed entries", () => {
    const agenda = [
      { time: "09:00 AM", topic: "Intro" },
      { time: "11:00 AM", topic: "Lab Walkthrough" },
    ];
    expect(sanitizeEventAgenda(agenda)).toEqual(agenda);
  });

  it("drops malformed entries", () => {
    const input = [
      { time: "09:00 AM" }, // missing topic
      { topic: "No time" }, // missing time
      "nope", // not an object
      null,
      { time: 42, topic: "Bad time type" },
    ];
    expect(sanitizeEventAgenda(input)).toEqual([]);
  });

  it("keeps well-formed entries mixed with malformed ones", () => {
    const input = [
      { time: "09:00 AM", topic: "Intro" },
      { time: 42, topic: "Bad" },
    ];
    expect(sanitizeEventAgenda(input)).toEqual([{ time: "09:00 AM", topic: "Intro" }]);
  });

  it("returns [] for non-array input", () => {
    expect(sanitizeEventAgenda(null)).toEqual([]);
    expect(sanitizeEventAgenda(undefined)).toEqual([]);
    expect(sanitizeEventAgenda("bad")).toEqual([]);
    expect(sanitizeEventAgenda({ time: "09:00 AM", topic: "x" })).toEqual([]);
  });
});
