import { useCallback, useRef, useState } from "react";
import { formatTime } from "@/hooks/useAudioPlayer";

type Props = {
  progress: number;
  duration: number;
  onSeek: (ratio: number) => void;
};

/**
 * Primary straight horizontal playback progress line with interactive seek functionality.
 */
export function ProgressBar({ progress, duration, onSeek }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState<number | null>(null);

  const effectiveProgress = dragging && dragProgress !== null ? dragProgress : progress;
  const pct = duration ? Math.min(100, Math.max(0, (effectiveProgress / duration) * 100)) : 0;

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el || !duration) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
      setDragProgress(ratio * duration);
      onSeek(ratio);
    },
    [duration, onSeek],
  );

  const startDrag = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDragging(true);
    seekFromClientX(e.clientX);

    const move = (ev: PointerEvent) => seekFromClientX(ev.clientX);
    const up = () => {
      setDragging(false);
      setDragProgress(null);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div className="w-full select-none">
      {/* Straight Horizontal Seek Track */}
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Seek progress"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration) || 0}
        aria-valuenow={Math.round(effectiveProgress)}
        aria-valuetext={`${formatTime(effectiveProgress)} of ${formatTime(duration)}`}
        onPointerDown={startDrag}
        onKeyDown={(e) => {
          if (!duration) return;
          if (e.key === "ArrowRight") onSeek((progress + 5) / duration);
          if (e.key === "ArrowLeft") onSeek((progress - 5) / duration);
        }}
        className="group relative -my-2.5 cursor-pointer touch-none py-2.5 focus-visible:outline-none"
      >
        {/* Track Line Background */}
        <div className="h-[3px] w-full overflow-hidden rounded-full bg-cream/20 transition-all duration-200 group-hover:h-[4px]">
          {/* Active Played Fill */}
          <div
            className="h-full rounded-full bg-cream/90"
            style={{
              width: `${pct}%`,
              transition: dragging ? "none" : "width 150ms linear",
            }}
          />
        </div>

        {/* Subtle Position Thumb Dot */}
        <span
          className="pointer-events-none absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-150 group-hover:scale-125"
          style={{
            left: `${pct}%`,
            opacity: dragging || pct > 0 ? 1 : 0.6,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Timestamps */}
      <div className="mt-1 flex justify-between text-[0.68rem] font-medium tabular-nums tracking-[0.06em] text-cream/55 sm:text-xs">
        <span>{formatTime(effectiveProgress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}
