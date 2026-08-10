import { Disc3, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { playlist } from "@/data/playlist";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { AudioWaveform } from "./AudioWaveform";
import { PlayerControls } from "./PlayerControls";
import { ProgressBar } from "./ProgressBar";

export function MusicPlayer() {
  const {
    displayTitle,
    displayArtist,
    displayCover,
    isPlaying,
    isLoading,
    progress,
    duration,
    error,
    toggle,
    next,
    previous,
    retry,
    seek,
  } = useAudioPlayer(playlist);

  const [coverOk, setCoverOk] = useState(false);

  // Validate image URL loading before displaying artwork
  useEffect(() => {
    setCoverOk(false);
    if (!displayCover) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => !cancelled && setCoverOk(true);
    img.onerror = () => !cancelled && setCoverOk(false);
    img.src = displayCover;
    return () => {
      cancelled = true;
    };
  }, [displayCover]);

  return (
    <div className="relative w-full">
      {/* Ambient background blur halo */}
      <div
        className="player-halo pointer-events-none absolute -inset-4 -z-10 rounded-[32px]"
        aria-hidden="true"
      />

      {/* Main Apple-Inspired Translucent Glass Surface */}
      <section
        aria-label="Digital Bus radio player"
        className="glass-panel group/player relative w-full overflow-hidden rounded-[26px] p-4 sm:p-5"
      >
        {/* Upper Track Details & Controls Section */}
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Album Art & Track Meta */}
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
            {/* Album Artwork */}
            <div className="relative h-[56px] w-[56px] shrink-0 overflow-hidden rounded-[16px] bg-black/30 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.15)] sm:h-[64px] sm:w-[64px]">
              {coverOk ? (
                <img
                  key={displayCover}
                  src={displayCover}
                  alt={`Album artwork for ${displayTitle}`}
                  width={256}
                  height={256}
                  className="h-full w-full animate-fade-in object-cover"
                />
              ) : (
                <span className="grid h-full w-full place-items-center text-cream/40">
                  <Disc3 className="h-7 w-7" aria-hidden="true" />
                </span>
              )}
            </div>

            {/* Track Info & Small Spectrum Indicator */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold tracking-tight text-cream sm:text-[0.98rem]">
                {displayTitle}
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-cream/55 sm:text-[0.8rem]">
                {isLoading ? (
                  <span className="animate-pulse text-cream/80">Loading track...</span>
                ) : (
                  displayArtist
                )}
              </p>
              {error ? (
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[0.68rem] text-red-400 font-medium">Audio unavailable</span>
                  <button
                    onClick={retry}
                    className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] text-cream hover:bg-white/20 transition"
                  >
                    <RefreshCw className="h-3 w-3" /> Retry
                  </button>
                </div>
              ) : (
                /* Element A: Small Spectrum directly under song info */
                <div className="mt-2 sm:mt-2.5">
                  <AudioWaveform active={isPlaying} loading={isLoading} />
                </div>
              )}
            </div>
          </div>

          {/* Right: Controls (Prev, Play/Pause, Next) */}
          <div className="flex items-center justify-center sm:justify-end shrink-0 pt-0.5 sm:pt-0">
            <PlayerControls
              isPlaying={isPlaying}
              isLoading={isLoading}
              onToggle={toggle}
              onPrevious={previous}
              onNext={next}
            />
          </div>
        </div>

        {/* Element B: Large Straight Horizontal Progress Line at Bottom */}
        <div className="mt-3.5 sm:mt-4 pt-2.5 border-t border-white/10">
          <ProgressBar
            progress={progress}
            duration={duration}
            onSeek={seek}
          />
        </div>
      </section>
    </div>
  );
}
