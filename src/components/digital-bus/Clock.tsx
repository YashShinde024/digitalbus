import { useClock } from "@/hooks/useClock";

export function Clock() {
  const { time, date } = useClock();

  return (
    <div className="select-none text-glow" aria-live="off">
      <p className="text-xl font-medium tracking-tight text-cream sm:text-2xl">
        {time || "\u00A0"}
      </p>
      <p className="mt-0.5 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-cream/60 sm:text-xs">
        {date || "\u00A0"}
      </p>
    </div>
  );
}
