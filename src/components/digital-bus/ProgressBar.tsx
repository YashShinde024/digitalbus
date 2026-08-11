import { useCallback, useRef, useState, useEffect } from "react";
import { formatTime } from "@/hooks/useAudioPlayer";

type Props = {
  progress: number;
  duration: number;
  onSeek: (ratio: number) => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
};

/**
 * Primary horizontal playback progress bar with responsive pointer-captured seeking.
 * Visual drag state updates smoothly at 60fps via requestAnimationFrame without triggering
 * continuous audio seeking until pointer release.
 */
export function ProgressBar({ progress, duration, onSeek, onDragStart, onDragEnd }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const lastRatioRef = useRef<number>(0);

  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState<number | null>(null);

  // Use local drag progress when seeking; fallback to playback progress
  const effectiveProgress = isDragging && dragProgress !== null ? dragProgress : progress;
  const pct = duration ? Math.min(100, Math.max(0, (effectiveProgress / duration) * 100)) : 0;

  const calculateRatio = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  }, []);

  const updateVisualPosition = useCallback(
    (clientX: number) => {
      if (!duration) return;
      const ratio = calculateRatio(clientX);
      lastRatioRef.current = ratio;

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }

      rafIdRef.current = requestAnimationFrame(() => {
        setDragProgress(lastRatioRef.current * duration);
        onSeek(lastRatioRef.current);
      });
    },
    [duration, calculateRatio, onSeek],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!duration || e.button !== 0) return;
    e.preventDefault();

    const target = e.currentTarget;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    isDraggingRef.current = true;
    setIsDragging(true);
    onDragStart?.();

    updateVisualPosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    updateVisualPosition(e.clientX);
  };

  const commitSeek = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();

    const target = e.currentTarget;
    try {
      if (target.hasPointerCapture(e.pointerId)) {
        target.releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    const finalRatio = calculateRatio(e.clientX);
    setDragProgress(null);
    onSeek(finalRatio);
    onDragEnd?.();
  };

  useEffect(() => {
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={commitSeek}
        onPointerCancel={commitSeek}
        onKeyDown={(e) => {
          if (!duration) return;
          if (e.key === "ArrowRight") {
            const nextRatio = Math.min(1, (progress + 5) / duration);
            onSeek(nextRatio);
          }
          if (e.key === "ArrowLeft") {
            const prevRatio = Math.max(0, (progress - 5) / duration);
            onSeek(prevRatio);
          }
        }}
        className="group relative -my-2.5 cursor-pointer touch-none py-2.5 focus-visible:outline-none"
      >
        {/* Track Line Background */}
        <div className="h-[4px] w-full overflow-hidden rounded-full bg-cream/20 transition-all duration-200 group-hover:h-[5px]">
          {/* Active Played Fill */}
          <div
            className="h-full rounded-full bg-cream/90"
            style={{
              width: `${pct}%`,
              transition: isDragging ? "none" : "width 100ms linear",
            }}
          />
        </div>

        {/* Position Thumb Dot */}
        <span
          className={`pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-transform duration-100 ${
            isDragging ? "scale-125" : "group-hover:scale-125"
          }`}
          style={{
            left: `${pct}%`,
            opacity: isDragging || pct > 0 ? 1 : 0.6,
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
