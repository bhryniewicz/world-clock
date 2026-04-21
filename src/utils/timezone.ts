import type { ClockTime } from '../types';

export function getCurrentUTCOffset(ianaTimezone: string): number {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en', {
    timeZone: ianaTimezone,
    timeZoneName: 'shortOffset',
  });
  const parts = formatter.formatToParts(now);
  const tzName = parts.find(p => p.type === 'timeZoneName')?.value ?? 'GMT';
  if (tzName === 'GMT') return 0;
  const match = tzName.match(/GMT([+-])(\d+)(?::(\d+))?/);
  if (!match) return 0;
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = match[3] ? parseInt(match[3], 10) : 0;
  return Math.round(sign * (hours + minutes / 60));
}

export function getTimeAtOffset(now: Date, offset: number): ClockTime {
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();
  const totalMinutes = utcHours * 60 + utcMinutes + offset * 60;
  const wrappedMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  return {
    hours: Math.floor(wrappedMinutes / 60),
    minutes: utcMinutes,
    seconds: utcSeconds,
  };
}

export function formatOffset(offset: number): string {
  if (offset === 0) return 'UTC';
  return `UTC${offset > 0 ? '+' : ''}${offset}`;
}
