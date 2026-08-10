import { Disc3, Radio, RefreshCw, Volume2, VolumeX } from "lucide-react";
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
    nextTrackTitle,
    isPlaying,
    isLoading,
    isMuted,
    progress,
    duration,
    error,
    isAmbientEnabled,
    toggleMute,
    toggleAmbient,
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Album Art & Track Meta */}
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
            {/* Album Artwork */}
            <div className="relative h-[56px] w-[56px] shrink-0 overflow-hidden rounded-[14px] bg-black/30 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.15)] sm:h-[60px] sm:w-[60px]">
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
                  <Disc3 className="h-7 w-7 animate-spin-slow" aria-hidden="true" />
                </span>
              )}
            </div>

            {/* Track Info & Mini Spectrum */}
            <div className="min-w-0 flex-1">
              <p
                key={displayTitle}
                className="truncate text-sm font-semibold tracking-tight text-cream sm:text-[0.98rem] animate-fade-in"
              >
                {displayTitle}
              </p>
              <p className="mt-0.5 truncate text-[0.7rem] font-medium text-cream/55 sm:text-[0.78rem]">
                {isLoading ? (
                  <span className="animate-pulse text-cream/80">Loading next ride...</span>
                ) : (
                  displayArtist
                )}
              </p>
              {error ? (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[0.65rem] text-red-400 font-medium">Audio unavailable</span>
                  <button
                    type="button"
                    onClick={retry}
                    className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] text-cream hover:bg-white/20 transition"
                  >
                    <RefreshCw className="h-2.5 w-2.5" /> Retry
                  </button>
                </div>
              ) : (
                /* Small Spectrum directly under song info */
                <div className="mt-1.5 w-28 shrink-0">
                  <AudioWaveform active={isPlaying && !isMuted} loading={isLoading} />
                </div>
              )}
            </div>
          </div>

          {/* Right: Mute & Ambient Sound Toggles + Controls (Coherent horizontal grid) */}
          <div className="flex items-center justify-center sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0">
            {/* Ambient Engine Rumble Toggle */}
            <button
              type="button"
              onClick={toggleAmbient}
              aria-label={
                isAmbientEnabled
                  ? "Turn off ambient bus road sounds"
                  : "Turn on ambient bus road sounds"
              }
              title={isAmbientEnabled ? "Ambient Bus Sounds: ON" : "Ambient Bus Sounds: OFF"}
              className={`grid h-9 w-9 place-items-center rounded-full text-cream/50 transition-all duration-200 hover:bg-white/10 hover:text-cream focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40 ${
                isAmbientEnabled ? "text-cream bg-white/15" : ""
              }`}
            >
              <Radio className="h-4 w-4" />
            </button>

            {/* Main Audio Mute / Unmute Button */}
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? "Unmute music" : "Mute music"}
              title={isMuted ? "Unmute Music" : "Mute Music"}
              className={`grid h-9 w-9 place-items-center rounded-full text-cream/70 transition-all duration-200 hover:bg-white/10 hover:text-cream active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40 ${
                isMuted ? "text-red-400 bg-red-950/30 border border-red-500/20" : ""
              }`}
            >
              {isMuted ? (
                <VolumeX className="h-4.5 w-4.5 text-red-400" />
              ) : (
                <Volume2 className="h-4.5 w-4.5 text-cream/80" />
              )}
            </button>

            {/* Main Playback Controls */}
            <PlayerControls
              isPlaying={isPlaying}
              isLoading={isLoading}
              onToggle={toggle}
              onPrevious={previous}
              onNext={next}
            />
          </div>
        </div>

        {/* Next Song Preview Header */}
        <div className="mt-4 flex items-center justify-between text-[0.62rem] font-medium tracking-[0.06em] text-cream/40 sm:text-[0.65rem] border-t border-white/5 pt-2.5">
          <span className="truncate max-w-full flex items-center gap-1.5">
            <span className="uppercase text-cream/30 tracking-widest font-semibold text-[0.55rem]">
              Next
            </span>
            <span className="truncate italic text-cream/50">{nextTrackTitle}</span>
          </span>
        </div>

        {/* Straight Horizontal Seek Line */}
        <div className="mt-2.5">
          <ProgressBar progress={progress} duration={duration} onSeek={seek} />
        </div>
      </section>
    </div>
  );
}
