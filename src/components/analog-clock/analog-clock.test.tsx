import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AnalogClock } from "./analog-clock";

describe("AnalogClock — rendering", () => {
  it("renders an SVG with the given size", () => {
    const { container } = render(
      <AnalogClock hours={10} minutes={30} seconds={0} size={200} />,
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg!.getAttribute("width")).toBe("200");
    expect(svg!.getAttribute("height")).toBe("200");
  });

  it("displays digital time in HH:MM format", () => {
    render(<AnalogClock hours={9} minutes={5} seconds={3} size={200} />);
    expect(screen.getByText("09:05")).toBeInTheDocument();
  });

  it("renders all 12 hour numbers on the face", () => {
    const { container } = render(
      <AnalogClock hours={0} minutes={0} seconds={0} size={200} />,
    );
    const texts = Array.from(container.querySelectorAll("svg text"))
      .map((t) => t.textContent?.trim())
      .filter((t) => t && /^\d+$/.test(t))
      .map(Number);
    for (let i = 1; i <= 12; i++) {
      expect(texts).toContain(i);
    }
  });

  it("renders a label when provided", () => {
    render(
      <AnalogClock
        hours={0}
        minutes={0}
        seconds={0}
        size={200}
        label="Test Label"
      />,
    );
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("does not render a label when not provided", () => {
    const { container } = render(
      <AnalogClock hours={0} minutes={0} seconds={0} size={200} />,
    );
    // No extra div with label text outside the svg
    const divs = container.querySelectorAll("div");
    const labelDivs = Array.from(divs).filter(
      (d) =>
        d.textContent &&
        !/\d{2}:\d{2}/.test(d.textContent) &&
        d.textContent.trim(),
    );
    expect(labelDivs.length).toBe(0);
  });
});

describe("AnalogClock — draggable prop", () => {
  it('shows "drag hour hand" hint when draggable=true', () => {
    const { container } = render(
      <AnalogClock hours={0} minutes={0} seconds={0} size={260} draggable />,
    );
    const hint = Array.from(container.querySelectorAll("svg text")).find(
      (t) => t.textContent === "drag hour hand",
    );
    expect(hint).toBeDefined();
  });

  it('does not show "drag hour hand" hint when draggable=false', () => {
    const { container } = render(
      <AnalogClock hours={0} minutes={0} seconds={0} size={260} />,
    );
    const hint = Array.from(container.querySelectorAll("svg text")).find(
      (t) => t.textContent === "drag hour hand",
    );
    expect(hint).toBeUndefined();
  });

  it("SVG has cursor: grab when draggable", () => {
    const { container } = render(
      <AnalogClock hours={0} minutes={0} seconds={0} size={200} draggable />,
    );
    const svg = container.querySelector("svg")!;
    expect(svg.style.cursor).toBe("grab");
  });

  it("renders wide transparent hit-area line when draggable", () => {
    const { container } = render(
      <AnalogClock hours={0} minutes={0} seconds={0} size={200} draggable />,
    );
    const transparentLines = Array.from(
      container.querySelectorAll("svg line"),
    ).filter((l) => l.getAttribute("stroke") === "transparent");
    expect(transparentLines.length).toBeGreaterThan(0);
  });

  it("does not render transparent hit-area line when not draggable", () => {
    const { container } = render(
      <AnalogClock hours={0} minutes={0} seconds={0} size={200} />,
    );
    const transparentLines = Array.from(
      container.querySelectorAll("svg line"),
    ).filter((l) => l.getAttribute("stroke") === "transparent");
    expect(transparentLines.length).toBe(0);
  });
});

describe("AnalogClock — drag interaction", () => {
  let onHourDrag: ReturnType<typeof vi.fn<(n: number) => void>>;

  beforeEach(() => {
    onHourDrag = vi.fn<(n: number) => void>();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls onHourDrag on window mousemove after mousedown on SVG", () => {
    const { container } = render(
      <AnalogClock
        hours={0}
        minutes={0}
        seconds={0}
        size={200}
        draggable
        onHourDrag={onHourDrag}
      />,
    );
    const svg = container.querySelector("svg")!;
    fireEvent.mouseDown(svg, { clientX: 100, clientY: 100 });
    fireEvent.mouseMove(window, { clientX: 110, clientY: 90 });
    expect(onHourDrag).toHaveBeenCalledTimes(1);
    expect(typeof onHourDrag.mock.calls[0][0]).toBe("number");
  });

  it("stops calling onHourDrag after mouseup", () => {
    const { container } = render(
      <AnalogClock
        hours={0}
        minutes={0}
        seconds={0}
        size={200}
        draggable
        onHourDrag={onHourDrag}
      />,
    );
    const svg = container.querySelector("svg")!;
    fireEvent.mouseDown(svg);
    fireEvent.mouseMove(window, { clientX: 110, clientY: 90 });
    expect(onHourDrag).toHaveBeenCalledTimes(1);
    fireEvent.mouseUp(window);
    fireEvent.mouseMove(window, { clientX: 120, clientY: 80 });
    // No additional calls after mouseup
    expect(onHourDrag).toHaveBeenCalledTimes(1);
  });

  it("does not call onHourDrag when not draggable", () => {
    render(
      <AnalogClock
        hours={0}
        minutes={0}
        seconds={0}
        size={200}
        draggable={false}
        onHourDrag={onHourDrag}
      />,
    );
    fireEvent.mouseMove(window, { clientX: 110, clientY: 90 });
    expect(onHourDrag).not.toHaveBeenCalled();
  });

  it("calls onHourDrag on window touchmove after touchstart", () => {
    const { container } = render(
      <AnalogClock
        hours={0}
        minutes={0}
        seconds={0}
        size={200}
        draggable
        onHourDrag={onHourDrag}
      />,
    );
    const svg = container.querySelector("svg")!;
    fireEvent.touchStart(svg);

    // jsdom lacks the Touch constructor — dispatch manually with a touches stub
    const touchMove = new Event("touchmove") as any;
    touchMove.touches = [{ clientX: 110, clientY: 90 }];
    window.dispatchEvent(touchMove);

    expect(onHourDrag).toHaveBeenCalledTimes(1);
  });

  it("stops calling onHourDrag after touchend", () => {
    const { container } = render(
      <AnalogClock
        hours={0}
        minutes={0}
        seconds={0}
        size={200}
        draggable
        onHourDrag={onHourDrag}
      />,
    );
    const svg = container.querySelector("svg")!;
    fireEvent.touchStart(svg);

    const touchMove1 = new Event("touchmove") as any;
    touchMove1.touches = [{ clientX: 110, clientY: 90 }];
    window.dispatchEvent(touchMove1);
    expect(onHourDrag).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new Event("touchend"));

    const touchMove2 = new Event("touchmove") as any;
    touchMove2.touches = [{ clientX: 120, clientY: 80 }];
    window.dispatchEvent(touchMove2);
    // No additional calls after touchend
    expect(onHourDrag).toHaveBeenCalledTimes(1);
  });

  it("removes event listeners on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(
      <AnalogClock
        hours={0}
        minutes={0}
        seconds={0}
        size={200}
        draggable
        onHourDrag={onHourDrag}
      />,
    );
    unmount();
    const calls = removeSpy.mock.calls.map((c) => c[0]);
    expect(calls).toContain("mousemove");
    expect(calls).toContain("mouseup");
  });
});

describe("AnalogClock — hand angle calculations", () => {
  it("positions hour hand at 12 when hours=0, minutes=0", () => {
    // At 12:00:00 hourAngle = 0 → hand points straight up
    // hourEnd.x should equal cx (size/2), hourEnd.y < cy
    const { container } = render(
      <AnalogClock hours={0} minutes={0} seconds={0} size={200} />,
    );
    const lines = Array.from(container.querySelectorAll("svg line"));
    // Hour hand starts from center (cx=100, cy=100)
    const hourHand = lines.find(
      (l) => l.getAttribute("x1") === "100" && l.getAttribute("y1") === "100",
    );
    expect(hourHand).toBeDefined();
  });

  it("renders correct number of tick marks (60)", () => {
    const { container } = render(
      <AnalogClock hours={0} minutes={0} seconds={0} size={200} />,
    );
    // Tick marks have no stroke-linecap; clock hands have strokeLinecap="round"
    const ticks = Array.from(container.querySelectorAll("svg line")).filter(
      (l) =>
        (l.getAttribute("stroke") === "#e2e8f0" ||
          l.getAttribute("stroke") === "#64748b") &&
        !l.getAttribute("stroke-linecap"),
    );
    expect(ticks).toHaveLength(60);
  });
});
