import { describe, it, expect } from "vitest";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { getCurrentUTCOffset } from "../utils/timezone";
import topoRaw from "../../public/timezones.json";

const topo = topoRaw as unknown as Topology;

const obj = topo.objects[
  Object.keys(topo.objects)[0]
] as GeometryCollection<{ tzid: string }>;

const tzFeatures = feature(topo, obj).features;
const tzids = tzFeatures.map((f) => f.properties.tzid).filter(Boolean);

describe("public/timezones.json — structure", () => {
  it("has a substantial number of timezone features", () => {
    expect(tzids.length).toBeGreaterThan(100);
  });

  it("every feature has a non-empty tzid property", () => {
    for (const f of tzFeatures) {
      expect(typeof f.properties.tzid).toBe("string");
      expect(f.properties.tzid.length).toBeGreaterThan(0);
    }
  });

  it("no duplicate tzids", () => {
    const unique = new Set(tzids);
    expect(unique.size).toBe(tzids.length);
  });
});

describe("public/timezones.json — IANA validity", () => {
  it("all tzids produce a valid UTC offset via getCurrentUTCOffset", () => {
    for (const tzid of tzids) {
      const offset = getCurrentUTCOffset(tzid);
      expect(Number.isInteger(offset)).toBe(true);
      expect(offset).toBeGreaterThanOrEqual(-12);
      expect(offset).toBeLessThanOrEqual(14);
    }
  });

  it("contains America/New_York", () => {
    expect(tzids).toContain("America/New_York");
  });

  it("contains UTC or Etc/UTC", () => {
    expect(tzids.some((id) => id === "UTC" || id === "Etc/UTC")).toBe(true);
  });
});
