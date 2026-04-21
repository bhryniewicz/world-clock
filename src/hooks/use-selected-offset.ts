import { useState } from 'react';

export function useSelectedOffset(now: Date) {
  const [selectedOffset, setSelectedOffset] = useState<number>(() =>
    -Math.round(new Date().getTimezoneOffset() / 60),
  );

  const handleHourDrag = (hour12: number) => {
    const utcDecimal = now.getUTCHours() + now.getUTCMinutes() / 60;
    const normalize = (o: number) => {
      while (o > 14) o -= 24;
      while (o < -12) o += 24;
      return Math.round(Math.max(-12, Math.min(14, o)));
    };
    const o1 = normalize(hour12 - utcDecimal);
    const o2 = normalize(hour12 + 12 - utcDecimal);
    setSelectedOffset(
      Math.abs(o1 - selectedOffset) <= Math.abs(o2 - selectedOffset) ? o1 : o2,
    );
  };

  return { selectedOffset, handleHourDrag };
}
