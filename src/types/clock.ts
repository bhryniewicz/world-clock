export interface AnalogClockProps {
  hours: number;
  minutes: number;
  seconds: number;
  size: number;
  draggable?: boolean;
  onHourDrag?: (newHour24: number) => void;
  label?: string;
  className?: string;
}
