import { Loader2, Pause, Play, SkipBack, SkipForward } from "lucide-react";

type Props = {
  isPlaying: boolean;
  isLoading?: boolean;
  onToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

const secondaryBtn =
  "grid h-10 w-10 place-items-center rounded-full text-cream/70 transition-all duration-200 hover:bg-white/10 hover:text-cream active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40";

export function PlayerControls({
  isPlaying,
  isLoading = false,
  onToggle,
  onPrevious,
  onNext,
}: Props) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* Previous Track */}
      <button
        type="button"
        aria-label="Previous track"
        onClick={onPrevious}
        className={secondaryBtn}
      >
        <SkipBack className="h-[18px] w-[18px] fill-current" />
      </button>

      {/* Primary Play/Pause Button */}
      <button
        type="button"
        aria-label={isLoading ? "Loading audio" : isPlaying ? "Pause" : "Play"}
        onClick={onToggle}
        className="relative grid h-[52px] w-[52px] place-items-center rounded-full border border-white/40 bg-white/90 text-ink shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all duration-200 hover:scale-[1.04] hover:bg-white active:scale-95 sm:h-[58px] sm:w-[58px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/80"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-ink" />
        ) : isPlaying ? (
          <Pause className="h-5 w-5 fill-current text-ink" />
        ) : (
          <Play className="ml-[2px] h-5 w-5 fill-current text-ink" />
        )}
      </button>

      {/* Next Track */}
      <button type="button" aria-label="Next track" onClick={onNext} className={secondaryBtn}>
        <SkipForward className="h-[18px] w-[18px] fill-current" />
      </button>
    </div>
  );
}
