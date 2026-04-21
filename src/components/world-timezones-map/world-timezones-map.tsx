import React, { useEffect, useMemo, useState } from "react";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import { getCurrentUTCOffset } from "../../utils/timezone";
import { pathGen, hue, fill } from "../../lib/geo";
import { MAP_WIDTH as W, MAP_HEIGHT as H, TIMEZONES_URL } from "../../config/constants";
import type { TzFeature, Tooltip } from "../../types";

const offsetCache: Record<string, number> = {};
function getTzOffset(tzid: string): number {
  if (tzid in offsetCache) return offsetCache[tzid];
  const offset = getCurrentUTCOffset(tzid);
  offsetCache[tzid] = offset;
  return offset;
}

interface Props {
  selectedOffset: number;
}

const WorldTimezoneMap: React.FC<Props> = ({ selectedOffset }) => {
  const [features, setFeatures] = useState<TzFeature[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);

  useEffect(() => {
    fetch(TIMEZONES_URL)
      .then((r) => r.json())
      .then((topo) => {
        const topo_ = topo as Topology;
        const obj = topo_.objects[Object.keys(topo_.objects)[0]] as GeometryCollection<{ tzid: string }>;
        const fc = feature(topo_, obj);
        setFeatures(fc.features as unknown as TzFeature[]);
      })
      .catch((err) => console.error("Failed to load timezones.json", err));
  }, []);

  const paths = useMemo(
    () =>
      features.map((geo) => ({
        tzid: geo.properties.tzid,
        d: pathGen(geo as any) ?? "",
        offset: getTzOffset(geo.properties.tzid),
      })),
    [features],
  );

  const label = (o: number) => (o === 0 ? "UTC" : `${o > 0 ? "+" : ""}${o}`);
  const selHue = hue(selectedOffset);

  return (
    <div className="flex flex-col grow bg-[#0c1929] rounded-2xl border border-[#1e3a5f] p-4 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="text-slate-400 text-xs text-center mb-2 tracking-widest uppercase">
        Time Zone Map —{" "}
        {selectedOffset === 0 ? "UTC" : `UTC${label(selectedOffset)}`}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
        <rect x={0} y={0} width={W} height={H} fill="#0d2137" />

        {paths.map(({ tzid, d, offset }) => {
          const sel = offset === selectedOffset;
          const hov = hovered === tzid;
          const h = hue(offset);
          return (
            <path
              key={tzid}
              d={d}
              fill={fill(offset, sel, hov)}
              stroke={sel ? `hsl(${h},85%,65%)` : `hsl(${h},25%,14%)`}
              strokeWidth={sel ? 0.8 : 0.3}
              style={{ cursor: "default" }}
              onMouseEnter={(e) => {
                setHovered(tzid);
                const rect = (
                  e.currentTarget.ownerSVGElement as SVGSVGElement
                ).getBoundingClientRect();
                const svgX = ((e.clientX - rect.left) / rect.width) * W;
                const svgY = ((e.clientY - rect.top) / rect.height) * H;
                setTooltip({ tzid, offset, x: svgX, y: svgY });
              }}
              onMouseMove={(e) => {
                const rect = (
                  e.currentTarget.ownerSVGElement as SVGSVGElement
                ).getBoundingClientRect();
                const svgX = ((e.clientX - rect.left) / rect.width) * W;
                const svgY = ((e.clientY - rect.top) / rect.height) * H;
                setTooltip((t) => (t ? { ...t, x: svgX, y: svgY } : null));
              }}
              onMouseLeave={() => {
                setHovered(null);
                setTooltip(null);
              }}
            />
          );
        })}

        {tooltip &&
          (() => {
            const offsetLabel =
              tooltip.offset === 0
                ? "UTC"
                : `UTC${tooltip.offset > 0 ? "+" : ""}${tooltip.offset}`;
            const text = `${tooltip.tzid}  ${offsetLabel}`;
            const tw = text.length * 5.8 + 16;
            const tx = Math.min(Math.max(tooltip.x - tw / 2, 4), W - tw - 4);
            const ty = tooltip.y > H * 0.75 ? tooltip.y - 36 : tooltip.y + 14;
            return (
              <g style={{ pointerEvents: "none" }}>
                <rect
                  x={tx}
                  y={ty}
                  width={tw}
                  height={22}
                  rx={4}
                  fill="#0f2744"
                  stroke="#2d5a8e"
                  strokeWidth={0.8}
                />
                <text
                  x={tx + tw / 2}
                  y={ty + 14}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#e2e8f0"
                  fontFamily="'Segoe UI', sans-serif"
                >
                  {text}
                </text>
              </g>
            );
          })()}

        {/* Selected timezone band */}
        {(() => {
          const xOf = (o: number) => o * 15 * (Math.PI / 180) * 153 + W / 2;
          const x1 = xOf(selectedOffset - 1);
          const x2 = xOf(selectedOffset);
          return (
            <rect
              x={x1}
              y={5}
              width={x2 - x1}
              height={H - 17}
              fill={`hsl(${selHue},70%,50%)`}
              fillOpacity={0.12}
              stroke={`hsl(${selHue},85%,65%)`}
              strokeWidth={0.8}
              strokeOpacity={0.5}
              rx={1}
              style={{ pointerEvents: "none" }}
            />
          );
        })()}

        {/* UTC meridian lines */}
        {Array.from({ length: 25 }, (_, i) => i - 12).map((o) => {
          const x = o * 15 * (Math.PI / 180) * 153 + W / 2;
          const sel = o === selectedOffset;
          const h = hue(o);
          return (
            <g key={`m${o}`}>
              <line
                x1={x}
                y1={5}
                x2={x}
                y2={H - 12}
                stroke={sel ? `hsl(${h},85%,65%)` : "#1e3a5f"}
                strokeWidth={sel ? 1.2 : 0.4}
                strokeDasharray={sel ? "5,3" : "3,4"}
                strokeOpacity={sel ? 1 : 0.6}
              />
              <text
                x={x}
                y={H - 2}
                textAnchor="middle"
                fontSize={sel ? 7.5 : 6.5}
                fill={sel ? `hsl(${h},85%,65%)` : "#475569"}
                fontFamily="'Segoe UI', sans-serif"
                fontWeight={sel ? "bold" : "normal"}
              >
                {o === 0 ? "UTC" : `${o > 0 ? "+" : ""}${o}`}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex justify-center gap-5 mt-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <div
            className="w-3.5 h-3.5 rounded-sm"
            style={{
              background: `hsl(${selHue},72%,46%)`,
              border: `1px solid hsl(${selHue},85%,65%)`,
            }}
          />
          Current zone (UTC{label(selectedOffset)})
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 bg-[#1e3344] rounded-sm" />
          Other zones
        </div>
      </div>
    </div>
  );
};

export default WorldTimezoneMap;
