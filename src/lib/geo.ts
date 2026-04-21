import { geoEqualEarth, geoPath } from 'd3-geo';
import { MAP_WIDTH, MAP_HEIGHT } from '../config/constants';

export const projection = geoEqualEarth()
  .scale(153)
  .translate([MAP_WIDTH / 2, MAP_HEIGHT / 2]);

export const pathGen = geoPath().projection(projection);

export function hue(offset: number): number {
  return Math.round(((offset + 12) / 26) * 300);
}

export function fill(offset: number, selected: boolean, hovered: boolean): string {
  const h = hue(offset);
  if (selected && hovered) return `hsl(${h},80%,58%)`;
  if (selected) return `hsl(${h},72%,46%)`;
  if (hovered) return `hsl(${h},48%,30%)`;
  return `hsl(${h},38%,22%)`;
}
