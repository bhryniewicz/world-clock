import { describe, it, expect } from "vitest";
import { getCurrentUTCOffset, getTimeAtOffset, formatOffset } from "./timezone";

describe("getCurrentUTCOffset", () => {
  it("returns 0 for UTC", () => {
    expect(getCurrentUTCOffset("UTC")).toBe(0);
  });

  it("returns positive offset for UTC+ zones", () => {
    expect(getCurrentUTCOffset("Asia/Tokyo")).toBe(9);
  });

  it("returns negative offset for UTC- zones", () => {
    expect(getCurrentUTCOffset("America/Jamaica")).toBe(-5);
  });

  it("throws RangeError for unknown timezone string", () => {
    expect(() => getCurrentUTCOffset("Not/ATimezone")).toThrow(RangeError);
  });
});

describe("getTimeAtOffset", () => {
  it("returns correct hours, minutes, seconds for UTC+0", () => {
    const now = new Date("2024-01-01T12:30:45Z");
    const result = getTimeAtOffset(now, 0);
    expect(result.hours).toBe(12);
    expect(result.minutes).toBe(30);
    expect(result.seconds).toBe(45);
  });

  it("applies positive offset correctly", () => {
    const now = new Date("2024-01-01T10:00:00Z");
    expect(getTimeAtOffset(now, 5).hours).toBe(15);
  });

  it("wraps past midnight correctly", () => {
    const now = new Date("2024-01-01T23:00:00Z");
    expect(getTimeAtOffset(now, 2).hours).toBe(1);
  });

  it("wraps before midnight correctly", () => {
    const now = new Date("2024-01-01T01:00:00Z");
    expect(getTimeAtOffset(now, -3).hours).toBe(22);
  });
});

describe("formatOffset", () => {
  it('returns "UTC" for offset 0', () => {
    expect(formatOffset(0)).toBe("UTC");
  });

  it('returns "UTC+5" for positive offset', () => {
    expect(formatOffset(5)).toBe("UTC+5");
  });

  it('returns "UTC-3" for negative offset', () => {
    expect(formatOffset(-3)).toBe("UTC-3");
  });
});
