import { ListMusic, Loader2, Pause, Play, Shuffle, SkipBack, SkipForward } from "lucide-react";

type Props = {
  isPlaying: boolean;
  isLoading?: boolean;
  isShuffle?: boolean;
  isPlaylistOpen?: boolean;
  onToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onToggleShuffle?: () => void;
  onTogglePlaylist?: () => void;
};

const secondaryBtn =
  "grid h-[38px] w-[38px] sm:h-10 sm:w-10 place-items-center rounded-full text-cream/70 transition-all duration-200 hover:bg-white/10 hover:text-cream active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40";

export function PlayerControls({
  isPlaying,
  isLoading = false,
  isShuffle = false,
  isPlaylistOpen = false,
  onToggle,
  onPrevious,
  onNext,
  onToggleShuffle,
  onTogglePlaylist,
}: Props) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Shuffle Toggle */}
      <button
        type="button"
        aria-label={isShuffle ? "Disable shuffle" : "Enable shuffle"}
        title={isShuffle ? "Shuffle: ON" : "Shuffle: OFF"}
        onClick={onToggleShuffle}
        className={`${secondaryBtn} ${
          isShuffle ? "text-amber-300 bg-white/15 border border-amber-300/30" : ""
        }`}
      >
        <Shuffle className="h-4 w-4" />
      </button>

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
        className="relative grid h-[48px] w-[48px] place-items-center rounded-full border border-white/40 bg-white/90 text-ink shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all duration-200 hover:scale-[1.04] hover:bg-white active:scale-95 sm:h-[54px] sm:w-[54px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream/80 shrink-0"
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

      {/* Playlist / Queue Toggle */}
      <button
        type="button"
        aria-label={isPlaylistOpen ? "Close playlist queue" : "Open playlist queue"}
        title={isPlaylistOpen ? "Close Playlist" : "View Playlist Queue"}
        onClick={onTogglePlaylist}
        className={`${secondaryBtn} ${
          isPlaylistOpen ? "text-amber-300 bg-white/15 border border-amber-300/30" : ""
        }`}
      >
        <ListMusic className="h-4 w-4" />
      </button>
    </div>
  );
}
