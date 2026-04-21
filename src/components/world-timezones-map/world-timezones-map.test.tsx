import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import WorldTimezoneMap from "./world-timezones-map";

// Mock d3-geo — module-level constants are set when the module is first imported
vi.mock("d3-geo", () => {
  const mockPathFn = Object.assign(
    vi.fn(() => "M0,0Z"),
    {
      projection: vi.fn().mockReturnThis(),
    },
  );
  const mockProjection = {
    scale: vi.fn().mockReturnThis(),
    translate: vi.fn().mockReturnThis(),
  };
  return {
    geoEqualEarth: vi.fn(() => mockProjection),
    geoPath: vi.fn(() => mockPathFn),
  };
});

// Mock topojson-client
vi.mock("topojson-client", () => ({
  feature: vi.fn(() => ({
    features: [
      {
        type: "Feature",
        properties: { tzid: "America/New_York" },
        geometry: { type: "Polygon", coordinates: [] },
      },
      {
        type: "Feature",
        properties: { tzid: "Europe/Berlin" },
        geometry: { type: "Polygon", coordinates: [] },
      },
    ],
  })),
}));

const mockTopoJSON = {
  type: "Topology",
  objects: {
    timezones: { type: "GeometryCollection", geometries: [] },
  },
  arcs: [],
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockTopoJSON),
      } as Response),
    ),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("WorldTimezoneMap — heading", () => {
  it('renders "Time Zone Map" in the heading', async () => {
    const { container } = render(<WorldTimezoneMap selectedOffset={0} />);
    const heading = container.querySelector("div > div:first-child");
    expect(heading?.textContent).toMatch(/Time Zone Map/i);
    await act(async () => {});
  });

  it('shows "UTC" when selectedOffset is 0', async () => {
    const { container } = render(<WorldTimezoneMap selectedOffset={0} />);
    const heading = container.querySelector("div > div:first-child");
    expect(heading?.textContent).toContain("UTC");
    await act(async () => {});
  });

  it('shows "UTC+5" for selectedOffset=5', async () => {
    const { container } = render(<WorldTimezoneMap selectedOffset={5} />);
    const heading = container.querySelector("div > div:first-child");
    expect(heading?.textContent).toContain("UTC+5");
    await act(async () => {});
  });

});

describe("WorldTimezoneMap — SVG structure", () => {
  it("renders an SVG element", async () => {
    const { container } = render(<WorldTimezoneMap selectedOffset={0} />);
    expect(container.querySelector("svg")).not.toBeNull();
    await act(async () => {});
  });

  it("renders exactly 25 meridian lines (UTC-12 to UTC+12)", async () => {
    const { container } = render(<WorldTimezoneMap selectedOffset={0} />);
    const lines = container.querySelectorAll("svg line");
    expect(lines.length).toBe(25);
    await act(async () => {});
  });

  it("renders meridian labels for all 25 offsets", async () => {
    const { container } = render(<WorldTimezoneMap selectedOffset={0} />);
    const svgTexts = Array.from(container.querySelectorAll("svg text")).map(
      (t) => t.textContent,
    );
    // UTC label for 0
    expect(svgTexts).toContain("UTC");
    // Spot-check a few offsets
    expect(svgTexts).toContain("+1");
    expect(svgTexts).toContain("-1");
    expect(svgTexts).toContain("+12");
    expect(svgTexts).toContain("-12");
    await act(async () => {});
  });
});

describe("WorldTimezoneMap — geo data loading", () => {
  it("calls fetch with the timezones URL on mount", async () => {
    render(<WorldTimezoneMap selectedOffset={0} />);
    expect(fetch).toHaveBeenCalledWith("/timezones.json");
    await act(async () => {});
  });

  it("renders timezone paths after fetch resolves", async () => {
    const { container } = render(<WorldTimezoneMap selectedOffset={0} />);
    await waitFor(() => {
      const paths = container.querySelectorAll("svg path");
      expect(paths.length).toBeGreaterThan(0);
    });
  });

  it("handles fetch error gracefully (no crash)", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("Network error"))),
    );
    expect(() => render(<WorldTimezoneMap selectedOffset={0} />)).not.toThrow();
    await act(async () => {});
  });
});

describe("WorldTimezoneMap — legend", () => {
  it('shows "Current zone" in legend', async () => {
    render(<WorldTimezoneMap selectedOffset={0} />);
    expect(screen.getByText(/Current zone/i)).toBeInTheDocument();
    await act(async () => {});
  });

  it("legend shows the selected offset in current zone label", async () => {
    render(<WorldTimezoneMap selectedOffset={3} />);
    // The legend text "Current zone (UTC+3)" is unique enough to select specifically
    expect(screen.getByText(/Current zone \(UTC\+3\)/)).toBeInTheDocument();
    await act(async () => {});
  });

});

describe("WorldTimezoneMap — timezone features", () => {
  it("renders one path per timezone feature", async () => {
    const { container } = render(<WorldTimezoneMap selectedOffset={0} />);
    await waitFor(() => {
      // Mock returns 2 features; meridian lines are <line> not <path>
      const paths = container.querySelectorAll("svg path");
      expect(paths.length).toBe(2);
    });
  });

  it("shows tzid in tooltip on mouse enter", async () => {
    const { container } = render(<WorldTimezoneMap selectedOffset={0} />);
    await waitFor(() => {
      expect(container.querySelectorAll("svg path").length).toBe(2);
    });

    const paths = container.querySelectorAll("svg path");
    const svgEl = container.querySelector("svg")!;

    // Stub getBoundingClientRect so mouse coords resolve cleanly
    svgEl.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 800, height: 420 }) as DOMRect;

    fireEvent.mouseEnter(paths[0], { clientX: 100, clientY: 100 });

    await waitFor(() => {
      const tooltipTexts = Array.from(
        container.querySelectorAll("svg text"),
      ).map((t) => t.textContent ?? "");
      // Tooltip text contains the IANA tzid (America/New_York)
      expect(tooltipTexts.some((t) => t.includes("America/New_York"))).toBe(
        true,
      );
    });
  });

  it("hides tooltip on mouse leave", async () => {
    const { container } = render(<WorldTimezoneMap selectedOffset={0} />);
    await waitFor(() => {
      expect(container.querySelectorAll("svg path").length).toBe(2);
    });

    const paths = container.querySelectorAll("svg path");
    const svgEl = container.querySelector("svg")!;
    svgEl.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 800, height: 420 }) as DOMRect;

    fireEvent.mouseEnter(paths[0], { clientX: 100, clientY: 100 });
    await waitFor(() => {
      const texts = Array.from(container.querySelectorAll("svg text")).map(
        (t) => t.textContent ?? "",
      );
      expect(texts.some((t) => t.includes("America/New_York"))).toBe(true);
    });

    fireEvent.mouseLeave(paths[0]);
    await waitFor(() => {
      const texts = Array.from(container.querySelectorAll("svg text")).map(
        (t) => t.textContent ?? "",
      );
      expect(texts.some((t) => t.includes("America/New_York"))).toBe(false);
    });
  });
});
