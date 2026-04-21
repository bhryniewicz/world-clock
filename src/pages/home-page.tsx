import { useTime } from "../hooks/use-time";
import { useSelectedOffset } from "../hooks/use-selected-offset";
import { getTimeAtOffset, formatOffset } from "../utils/timezone";
import { CLOCK_SIZE_MAIN, CLOCK_SIZE_SECONDARY } from "../config/constants";
import { AnalogClock } from "../components/analog-clock/analog-clock";
import { WorldTimezoneMap } from "../components/world-timezones-map/world-timezones-map";

export const HomePage = () => {
  const now = useTime();
  const { selectedOffset, handleHourDrag } = useSelectedOffset(now);

  const mainTime = getTimeAtOffset(now, selectedOffset);
  const prevTime = getTimeAtOffset(now, selectedOffset - 1);
  const nextTime = getTimeAtOffset(now, selectedOffset + 1);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#060e1a] text-slate-200 px-4 py-6">
      <main className="flex gap-6 w-full ">
        <WorldTimezoneMap selectedOffset={selectedOffset} />

        <div className="flex flex-col items-center justify-center gap-8 mt-2">
          <div className="flex flex-col items-center gap-2.5 opacity-75 transition-opacity hover:opacity-100">
            <div className="clock-offset-badge prev text-[11px] font-semibold tracking-[0.08em] px-3 py-1 rounded-full font-mono bg-violet-500/12 border border-violet-900 text-violet-500">
              {formatOffset(selectedOffset)}
            </div>

            <AnalogClock
              hours={mainTime.hours}
              minutes={mainTime.minutes}
              seconds={mainTime.seconds}
              size={CLOCK_SIZE_MAIN}
              draggable
              onHourDrag={handleHourDrag}
            />
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-2.5 opacity-75 transition-opacity hover:opacity-100">
              <div className="clock-offset-badge prev text-[11px] font-semibold tracking-[0.08em] px-3 py-1 rounded-full font-mono bg-violet-500/12 border border-violet-900 text-violet-500">
                {formatOffset(selectedOffset - 1)}
              </div>
              <AnalogClock
                hours={prevTime.hours}
                minutes={prevTime.minutes}
                seconds={prevTime.seconds}
                size={CLOCK_SIZE_SECONDARY}
              />
            </div>

            <div className="flex flex-col items-center gap-2.5 opacity-75 transition-opacity hover:opacity-100">
              <div className="clock-offset-badge next text-[11px] font-semibold tracking-[0.08em] px-3 py-1 rounded-full font-mono bg-violet-500/12 border border-violet-900 text-violet-500">
                {formatOffset(selectedOffset + 1)}
              </div>
              <AnalogClock
                hours={nextTime.hours}
                minutes={nextTime.minutes}
                seconds={nextTime.seconds}
                size={CLOCK_SIZE_SECONDARY}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
