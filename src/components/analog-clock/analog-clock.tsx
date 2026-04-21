import { useRef, useCallback, useEffect } from "react";
import type { AnalogClockProps } from "../../types";

export const AnalogClock: React.FC<AnalogClockProps> = ({
  hours,
  minutes,
  seconds,
  size,
  draggable = false,
  onHourDrag,
  label,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const isDragging = useRef(false);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 8;

  // Angles in degrees (0 = 12 o'clock, clockwise)
  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourAngle = ((hours % 12) / 12) * 360 + (minutes / 60) * 30;

  const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);

  const handEnd = (angle: number, length: number) => ({
    x: cx + Math.cos(toRad(angle)) * length,
    y: cy + Math.sin(toRad(angle)) * length,
  });

  const getAngleFromCenter = (clientX: number, clientY: number): number => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = clientX - rect.left - cx;
    const my = clientY - rect.top - cy;
    let angle = Math.atan2(my, mx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle;
  };

  const angleToHour12 = (angle: number): number => {
    return (angle / 360) * 12;
  };

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!draggable) return;
      isDragging.current = true;
      e.preventDefault();
      e.stopPropagation();
    },
    [draggable],
  );

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || !onHourDrag) return;
      const angle = getAngleFromCenter(e.clientX, e.clientY);
      onHourDrag(angleToHour12(angle));
    },
    [onHourDrag],
  );

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    if (draggable) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }
  }, [draggable, onMouseMove, onMouseUp]);

  const onTouchStart = useCallback(
    (_e: React.TouchEvent) => {
      if (!draggable) return;
      isDragging.current = true;
    },
    [draggable],
  );

  useEffect(() => {
    if (!draggable) return;
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !onHourDrag) return;
      const touch = e.touches[0];
      const angle = getAngleFromCenter(touch.clientX, touch.clientY);
      onHourDrag(angleToHour12(angle));
    };
    const onTouchEnd = () => {
      isDragging.current = false;
    };
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [draggable, onHourDrag]);

  // Tick marks
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * 360;
    const isHour = i % 5 === 0;
    const inner = radius - (isHour ? 12 : 6);
    const outer = radius;
    const rad = toRad(angle);
    ticks.push(
      <line
        key={i}
        x1={cx + Math.cos(rad) * inner}
        y1={cy + Math.sin(rad) * inner}
        x2={cx + Math.cos(rad) * outer}
        y2={cy + Math.sin(rad) * outer}
        stroke={isHour ? "#e2e8f0" : "#64748b"}
        strokeWidth={isHour ? 2 : 1}
      />,
    );
  }

  // Hour numbers
  const numbers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i / 12) * 360;
    const rad = toRad(angle);
    const r = radius - 26;
    numbers.push(
      <text
        key={i}
        x={cx + Math.cos(rad) * r}
        y={cy + Math.sin(rad) * r}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.085}
        fill="#e2e8f0"
        fontFamily="'Segoe UI', sans-serif"
        fontWeight="600"
      >
        {i}
      </text>,
    );
  }

  const hourEnd = handEnd(hourAngle, radius * 0.55);
  const minuteEnd = handEnd(minuteAngle, radius * 0.78);

  const isMain = size > 200;

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <div
          className={`text-slate-400 tracking-widest font-medium ${isMain ? "text-sm" : "text-[11px]"}`}
        >
          {label}
        </div>
      )}
      <svg
        ref={svgRef}
        width={size}
        height={size}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        className="select-none"
        style={{ cursor: draggable ? "grab" : "default" }}
      >
        {/* Outer glow ring */}
        <circle
          cx={cx}
          cy={cy}
          r={radius + 4}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={isMain ? 3 : 2}
          opacity={0.3}
        />

        {/* Clock face */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="#0f172a"
          stroke="#1e293b"
          strokeWidth={2}
        />

        {/* Tick marks */}
        {ticks}

        {/* Hour numbers */}
        {numbers}

        {/* Hour hand */}
        <line
          x1={cx}
          y1={cy}
          x2={hourEnd.x}
          y2={hourEnd.y}
          stroke="#e2e8f0"
          strokeWidth={isMain ? 5 : 3.5}
          strokeLinecap="round"
        />
        {/* Wide invisible hit area for hour hand */}
        {draggable && (
          <line
            x1={cx}
            y1={cy}
            x2={hourEnd.x}
            y2={hourEnd.y}
            stroke="transparent"
            strokeWidth={24}
            strokeLinecap="round"
            style={{ cursor: "grab" }}
          />
        )}

        {/* Minute hand */}
        <line
          x1={cx}
          y1={cy}
          x2={minuteEnd.x}
          y2={minuteEnd.y}
          stroke="#94a3b8"
          strokeWidth={isMain ? 3 : 2}
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={isMain ? 5 : 3.5} fill="#f43f5e" />
        <circle cx={cx} cy={cy} r={isMain ? 2.5 : 1.5} fill="#0f172a" />

        {/* Drag hint for main clock */}
        {draggable && (
          <text
            x={cx}
            y={cy + radius * 0.65}
            textAnchor="middle"
            fontSize={9}
            fill="#475569"
            fontFamily="'Segoe UI', sans-serif"
          >
            drag hour hand
          </text>
        )}
      </svg>

      {/* Digital time display */}
      <div
        className={`text-slate-200 font-mono font-bold tracking-widest bg-slate-800 border border-slate-700 rounded-lg ${isMain ? "text-xl px-3.5 py-1.5" : "text-[13px] px-2.5 py-1"}`}
      >
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
      </div>
    </div>
  );
};
