export type UTCOffset = number;

export interface ClockTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TzFeature {
  properties: { tzid: string };
  [k: string]: unknown;
}

export interface Tooltip {
  tzid: string;
  offset: number;
  x: number;
  y: number;
}
