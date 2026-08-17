import {
  ChevronDown,
  Disc3,
  Loader2,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Share2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { playlist } from "@/data/playlist";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { AudioWaveform } from "./AudioWaveform";
import { PlayerControls } from "./PlayerControls";
import { PlaylistPanel } from "./PlaylistPanel";
import { ProgressBar } from "./ProgressBar";
import { ShareTicket } from "./ShareTicket";

export function MusicPlayer() {
  const {
    track,
    currentTrackIndex,
    displayTitle,
    displayArtist,
    displayCover,
    nextTrackTitle,
    isPlaying,
    isLoading,
    isMuted,
    isShuffle,
    progress,
    duration,
    error,
    isAmbientEnabled,
    toggleMute,
    toggleAmbient,
    toggleShuffle,
    toggle,
    next,
    previous,
    playTrack,
    retry,
    seek,
    setDraggingState,
  } = useAudioPlayer(playlist);

  const [coverOk, setCoverOk] = useState(false);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  // Swipe-to-dismiss state
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartYRef = useRef<number | null>(null);
  const [sheetTranslateY, setSheetTranslateY] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);

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

  useEffect(() => {
    if (!isMobileExpanded) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMobileExpanded]);

  // Close mobile expanded sheet on Escape key
  useEffect(() => {
    if (!isMobileExpanded) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileExpanded(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isMobileExpanded]);

  // Swipe-to-dismiss handlers for mobile sheet
  const handleSheetPointerDown = useCallback((e: React.PointerEvent) => {
    // Only track vertical drags from the top drag-handle area (first 60px of the sheet)
    const rect = sheetRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relativeY = e.clientY - rect.top;
    if (relativeY > 60) return; // Only allow drag from the handle area

    dragStartYRef.current = e.clientY;
    setSheetTranslateY(0);
  }, []);

  const handleSheetPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragStartYRef.current === null) return;
    const delta = e.clientY - dragStartYRef.current;
    if (delta > 0) {
      setSheetTranslateY(delta);
    }
  }, []);

  const handleSheetPointerUp = useCallback(() => {
    if (dragStartYRef.current === null) return;

    if (sheetTranslateY > 100) {
      // Dismiss threshold reached
      setIsDismissing(true);
      setTimeout(() => {
        setIsMobileExpanded(false);
        setIsDismissing(false);
        setSheetTranslateY(0);
      }, 280);
    } else {
      // Snap back
      setSheetTranslateY(0);
    }
    dragStartYRef.current = null;
  }, [sheetTranslateY]);

  // Open the share ticket modal (via the existing fixed trigger)
  const handleOpenShare = useCallback(() => {
    const btn = document.getElementById("share-ticket-button");
    if (btn) btn.click();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      digitalBusOpenPlaylist?: () => void;
      digitalBusOpenTicket?: () => void;
      digitalBusPlayerExpanded?: boolean;
    };
    w.digitalBusOpenPlaylist = () => setIsPlaylistOpen(true);
    w.digitalBusOpenTicket = handleOpenShare;
    w.digitalBusPlayerExpanded = isMobileExpanded;
    window.dispatchEvent(
      new CustomEvent("digitalbus:playerexpand", { detail: { expanded: isMobileExpanded } }),
    );
    return () => {
      delete w.digitalBusOpenPlaylist;
      delete w.digitalBusOpenTicket;
      delete w.digitalBusPlayerExpanded;
    };
  }, [handleOpenShare, isMobileExpanded]);

  // Progress ratio for collapsed mini-bar line
  const progressPct = duration ? Math.min(100, (progress / duration) * 100) : 0;

  return (
    <div className="relative w-full">
      {/* Ticket Share Modal Component with current track metadata */}
      <ShareTicket currentTrack={track} hiddenOnMobile={isMobileExpanded} />

      {/* Ambient background blur halo */}
      <div
        className="player-halo pointer-events-none absolute -inset-4 -z-10 rounded-[32px]"
        aria-hidden="true"
      />

      {/* Playlist / Queue Panel Drawer */}
      <PlaylistPanel
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        playlist={playlist}
        currentTrackIndex={currentTrackIndex}
        isPlaying={isPlaying}
        onSelectTrack={(idx) => playTrack(idx, true)}
      />

      {/* ════════════ DESKTOP PLAYER EXPERIENCE (sm:block) ════════════ */}
      <section
        aria-label="Digital Bus radio player"
        className="glass-panel group/player relative hidden sm:block w-full overflow-hidden rounded-[26px] p-4 sm:p-5"
      >
        {/* Upper Track Details & Controls Section */}
        <div className="flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Album Art & Track Meta */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
            {/* Album Artwork */}
            <div className="relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-[14px] bg-black/30 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.5),inset_0_0_0_1px_rgba(255,255,255,0.15)] sm:h-[60px] sm:w-[60px]">
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
                <div className="mt-1.5 w-28 shrink-0">
                  <AudioWaveform active={isPlaying && !isMuted} loading={isLoading} />
                </div>
              )}
            </div>
          </div>

          {/* Right: Audio Toggles & Main Playback Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 shrink-0 pt-1 sm:pt-0 border-t border-white/5 sm:border-0">
            {/* Audio Toggles */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleAmbient}
                aria-label={
                  isAmbientEnabled
                    ? "Turn off ambient bus road sounds"
                    : "Turn on ambient bus road sounds"
                }
                title={isAmbientEnabled ? "Ambient Bus Sounds: ON" : "Ambient Bus Sounds: OFF"}
                className={`grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full text-cream/50 transition-all duration-200 hover:bg-white/10 hover:text-cream focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40 ${
                  isAmbientEnabled ? "text-cream bg-white/15" : ""
                }`}
              >
                <Radio className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Unmute music" : "Mute music"}
                title={isMuted ? "Unmute Music (Key M)" : "Mute Music (Key M)"}
                className={`grid h-8 w-8 sm:h-9 sm:w-9 place-items-center rounded-full text-cream/70 transition-all duration-200 hover:bg-white/10 hover:text-cream active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40 ${
                  isMuted ? "text-red-400 bg-red-950/30 border border-red-500/20" : ""
                }`}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-red-400" />
                ) : (
                  <Volume2 className="h-4 w-4 text-cream/80" />
                )}
              </button>
            </div>

            <PlayerControls
              isPlaying={isPlaying}
              isLoading={isLoading}
              isShuffle={isShuffle}
              isPlaylistOpen={isPlaylistOpen}
              onToggle={toggle}
              onPrevious={previous}
              onNext={next}
              onToggleShuffle={toggleShuffle}
              onTogglePlaylist={() => setIsPlaylistOpen((prev) => !prev)}
            />
          </div>
        </div>

        {/* Next Song Preview Header */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between text-[0.62rem] font-medium tracking-[0.06em] text-cream/40 sm:text-[0.65rem] border-t border-white/5 pt-2 sm:pt-2.5">
          <span className="truncate max-w-full flex items-center gap-1.5">
            <span className="uppercase text-cream/30 tracking-widest font-semibold text-[0.55rem]">
              Next
            </span>
            <span className="truncate italic text-cream/50">{nextTrackTitle}</span>
          </span>
        </div>

        {/* Horizontal Seek Bar */}
        <div className="mt-2">
          <ProgressBar
            progress={progress}
            duration={duration}
            onSeek={seek}
            onDragStart={() => setDraggingState(true)}
            onDragEnd={() => setDraggingState(false)}
          />
        </div>
      </section>

      {/* ════════════ MOBILE COMPACT NOW PLAYING PLAYER (sm:hidden) ════════════ */}
      <div className="block sm:hidden w-full">
        {/* COLLAPSED STATE: Compact Now Playing Bar with Top Progress Indicator */}
        {!isMobileExpanded && (
          <div
            onClick={() => setIsMobileExpanded(true)}
            role="button"
            tabIndex={0}
            aria-label="Expand mobile music player"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setIsMobileExpanded(true);
            }}
            className="glass-panel fixed bottom-[max(0.85rem,env(safe-area-inset-bottom))] left-3 right-3 z-30 overflow-hidden rounded-[24px] border border-white/20 bg-black/75 shadow-[0_16px_45px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 active:scale-[0.98]"
          >
            {/* Top progress indicator line */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-white/10">
              <div
                className="h-full bg-cream/90 rounded-r-full"
                style={{
                  width: `${progressPct}%`,
                  transition: "width 200ms linear",
                }}
              />
            </div>

            <div className="flex items-center justify-between gap-3 p-2.5 pt-3">
              {/* Left: Thumbnail Artwork & Metadata */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-black/50 border border-white/20 shadow-md">
                  {coverOk ? (
                    <img
                      src={displayCover}
                      alt={displayTitle}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-cream/40">
                      <Disc3 className="h-5 w-5 animate-spin-slow" />
                    </span>
                  )}
                  {isPlaying && (
                    <span className="absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-[1px]">
                      <Volume2 className="h-4 w-4 text-cream animate-pulse" />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.84rem] font-bold text-cream tracking-tight">
                    {displayTitle}
                  </p>
                  <p className="truncate text-[0.7rem] text-cream/60 mt-0.5 font-medium">
                    {isLoading ? "Loading next track..." : displayArtist}
                  </p>
                </div>
              </div>

              {/* Right: Quick Queue, Play/Pause & Next Button */}
              <div
                className="flex items-center gap-1.5 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  aria-label="Open playlist queue"
                  onClick={() => setIsPlaylistOpen(true)}
                  className="grid h-9 w-9 place-items-center rounded-full text-cream/60 hover:bg-white/10 hover:text-cream active:scale-95 transition-colors"
                >
                  <Disc3 className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  aria-label={isPlaying ? "Pause" : "Play"}
                  onClick={toggle}
                  className="grid h-10 w-10 place-items-center rounded-full bg-cream text-ink shadow-lg active:scale-95 transition-transform"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-ink" />
                  ) : isPlaying ? (
                    <Pause className="h-4 w-4 fill-current text-ink" />
                  ) : (
                    <Play className="ml-0.5 h-4 w-4 fill-current text-ink" />
                  )}
                </button>

                <button
                  type="button"
                  aria-label="Next track"
                  onClick={next}
                  className="grid h-9 w-9 place-items-center rounded-full text-cream/70 hover:bg-white/10 active:scale-95 transition-colors"
                >
                  <SkipForward className="h-4 w-4 fill-current" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EXPANDED STATE: Full Mobile Sheet / Modal Player */}
        {isMobileExpanded && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Expanded Music Player"
            className="fixed inset-0 z-[50] flex flex-col justify-end bg-black/80 backdrop-blur-md animate-fade-in"
          >
            {/* Backdrop Dismiss Area */}
            <div className="flex-1 w-full" onClick={() => setIsMobileExpanded(false)} />

            {/* Expanded Sheet Card */}
            <div
              ref={sheetRef}
              onPointerDown={handleSheetPointerDown}
              onPointerMove={handleSheetPointerMove}
              onPointerUp={handleSheetPointerUp}
              onPointerCancel={handleSheetPointerUp}
              className={`relative max-h-[92svh] overflow-y-auto hide-scrollbar w-full rounded-t-[34px] border-t border-white/20 bg-black/85 px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-24px_70px_rgba(0,0,0,0.9)] backdrop-blur-3xl touch-none ${
                isDismissing ? "animate-slide-down" : "animate-slide-up"
              }`}
              style={{
                transform: sheetTranslateY > 0 ? `translateY(${sheetTranslateY}px)` : undefined,
                transition: sheetTranslateY > 0 ? "none" : undefined,
              }}
            >
              {/* Pill drag handle indicator */}
              <div className="flex justify-center pb-4 pt-1">
                <button
                  type="button"
                  onClick={() => setIsMobileExpanded(false)}
                  aria-label="Collapse mobile player"
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <span className="block h-[5px] w-12 rounded-full bg-white/30 group-hover:bg-white/50 transition-colors" />
                  <ChevronDown className="h-4 w-4 text-cream/40 group-hover:text-cream/70 transition-colors" />
                </button>
              </div>

              {/* Large Cover Artwork with ambient glow */}
              <div className="mx-auto w-[min(68vw,270px)] aspect-square overflow-hidden rounded-[26px] bg-black/50 border border-white/20 shadow-2xl artwork-glow">
                {coverOk ? (
                  <img
                    src={displayCover}
                    alt={displayTitle}
                    className="h-full w-full object-cover animate-fade-in"
                  />
                ) : (
                  <span className="grid h-full w-full place-items-center text-cream/40">
                    <Disc3 className="h-12 w-12 animate-spin-slow" />
                  </span>
                )}
              </div>

              {/* Song Title, Artist, Album & Year context */}
              <div className="text-center mt-5 mb-1 px-2">
                <h3 className="truncate text-[1.15rem] font-bold text-cream tracking-tight">
                  {displayTitle}
                </h3>
                <p className="truncate text-[0.84rem] font-medium text-cream/60 mt-1">
                  {displayArtist}
                </p>
                {(track?.album || track?.year) && (
                  <p className="truncate text-[0.7rem] text-cream/40 mt-1 italic">
                    {track.album}
                    {track.album && track.year ? " · " : ""}
                    {track.year || ""}
                  </p>
                )}
                <div className="mt-3 flex justify-center">
                  <AudioWaveform active={isPlaying && !isMuted} loading={isLoading} />
                </div>
              </div>

              {/* Progress Seek Bar */}
              <div className="mt-4 mb-2 px-1">
                <ProgressBar
                  progress={progress}
                  duration={duration}
                  onSeek={seek}
                  onDragStart={() => setDraggingState(true)}
                  onDragEnd={() => setDraggingState(false)}
                />
              </div>

              {/* Full Playback Controls Row */}
              <div className="my-2">
                <PlayerControls
                  isPlaying={isPlaying}
                  isLoading={isLoading}
                  isShuffle={isShuffle}
                  isPlaylistOpen={isPlaylistOpen}
                  onToggle={toggle}
                  onPrevious={previous}
                  onNext={next}
                  onToggleShuffle={toggleShuffle}
                  onTogglePlaylist={() => setIsPlaylistOpen((prev) => !prev)}
                />
              </div>

              {/* Extra Action Controls Row: Share, Ambient, Mute */}
              <div className="flex items-center justify-center gap-3 border-t border-white/10 pt-4 mt-3">
                <button
                  type="button"
                  onClick={handleOpenShare}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-cream/80 transition-all hover:bg-white/15 active:scale-95"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={toggleAmbient}
                  className={`flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-cream/80 transition-all active:scale-95 ${
                    isAmbientEnabled ? "bg-white/20 border-white/40 text-cream" : "bg-white/5"
                  }`}
                >
                  <Radio className="h-3.5 w-3.5" />
                  <span>Ambient</span>
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  className={`flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-cream/80 transition-all active:scale-95 ${
                    isMuted ? "bg-red-950/40 border-red-500/30 text-red-300" : "bg-white/5"
                  }`}
                >
                  {isMuted ? (
                    <VolumeX className="h-3.5 w-3.5 text-red-400" />
                  ) : (
                    <Volume2 className="h-3.5 w-3.5 text-cream/80" />
                  )}
                  <span>{isMuted ? "Muted" : "Mute"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
