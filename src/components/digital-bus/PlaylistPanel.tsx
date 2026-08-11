import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "@/data/playlist";
import { Disc3, Music2, Volume2, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  playlist: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number) => void;
};

export function PlaylistPanel({
  isOpen,
  onClose,
  playlist,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const [coverStates, setCoverStates] = useState<Record<number, boolean>>({});

  // Auto-scroll active playing song into view when panel opens
  useEffect(() => {
    if (isOpen && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isOpen, currentTrackIndex]);

  // Preload visible cover images
  useEffect(() => {
    if (!isOpen) return;
    const newStates: Record<number, boolean> = {};
    let cancelled = false;

    playlist.forEach((track, idx) => {
      if (!track.cover) return;
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        setCoverStates((prev) => ({ ...prev, [idx]: true }));
      };
      img.onerror = () => {
        if (cancelled) return;
        setCoverStates((prev) => ({ ...prev, [idx]: false }));
      };
      img.src = track.cover;
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, playlist]);

  // Click outside listener (desktop only — mobile uses backdrop)
  useEffect(() => {
    if (!isOpen) return;

    // Only attach outside-click for desktop
    const isMobile = window.innerWidth < 640;
    if (isMobile) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trackList = (
    <div className="flex flex-col gap-0.5 overflow-y-auto hide-scrollbar overscroll-contain">
      {playlist.map((track, idx) => {
        const isActive = idx === currentTrackIndex;
        const hasCover = coverStates[idx] === true;

        return (
          <button
            key={track.id ?? idx}
            ref={isActive ? activeItemRef : undefined}
            type="button"
            onClick={() => {
              onSelectTrack(idx);
              onClose();
            }}
            className={`group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50 ${
              isActive
                ? "bg-white/12 text-cream"
                : "hover:bg-white/8 text-cream/70 hover:text-cream"
            }`}
          >
            {/* Amber accent bar for active track */}
            {isActive && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full bg-amber-300/80"
                aria-hidden="true"
              />
            )}

            {/* Track Artwork Thumbnail */}
            <div className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-black/30 border ${
              isActive ? "border-white/25" : "border-white/10"
            }`}>
              {hasCover ? (
                <img
                  src={track.cover}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <span className="grid h-full w-full place-items-center text-cream/30">
                  <Disc3 className="h-4 w-4" />
                </span>
              )}
              {/* Playing overlay indicator */}
              {isActive && isPlaying && (
                <span className="absolute inset-0 grid place-items-center bg-black/40">
                  <Volume2 className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
                </span>
              )}
            </div>

            {/* Track Details */}
            <div className="min-w-0 flex-1">
              <p
                className={`truncate text-[0.82rem] font-medium ${
                  isActive ? "text-amber-200 font-semibold" : "text-cream"
                }`}
              >
                {track.title}
              </p>
              <p className="truncate text-[0.68rem] text-cream/45">
                {track.artist}{track.album ? ` · ${track.album}` : ""}
              </p>
            </div>

            {/* Right: Year / Playing Badge */}
            <div className="shrink-0 text-right">
              {isActive ? (
                <span className="rounded-full bg-amber-400/15 border border-amber-400/25 px-2 py-0.5 text-[0.55rem] font-semibold text-amber-200/90 uppercase tracking-wider">
                  Playing
                </span>
              ) : track.year ? (
                <span className="text-[0.62rem] font-medium text-cream/30">
                  {track.year}
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      {/* ──── DESKTOP: Popover Panel (≥640px) ──── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Playlist queue"
        aria-modal="true"
        className="glass-panel absolute bottom-[calc(100%+0.75rem)] left-0 right-0 z-[40]
          mx-auto max-h-[380px] w-full max-w-[34rem] overflow-hidden
          rounded-[24px] border border-white/20 bg-ink/95 p-3.5 sm:p-4
          shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-xl animate-fade-in
          hidden sm:block"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2.5 px-1">
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4 text-amber-300" />
            <span className="text-xs font-semibold tracking-wider text-cream uppercase">
              Travel Playlist
            </span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] font-medium text-cream/60">
              {playlist.length} tracks
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close playlist"
            className="grid h-7 w-7 place-items-center rounded-full text-cream/50 transition-colors hover:bg-white/10 hover:text-cream focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40 active:scale-95"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Track List */}
        <div className="mt-2 max-h-[300px] pr-1">
          {trackList}
        </div>
      </div>

      {/* ──── MOBILE: Full-screen bottom sheet drawer (<640px) ──── */}
      <div className="fixed inset-0 z-[55] flex flex-col justify-end bg-black/70 backdrop-blur-sm animate-fade-in sm:hidden">
        {/* Backdrop dismiss */}
        <div className="flex-1 w-full" onClick={onClose} />

        {/* Sheet */}
        <div className="relative w-full max-h-[85vh] rounded-t-[28px] border-t border-white/15 bg-[#13100b]/[0.97] backdrop-blur-2xl shadow-[0_-16px_50px_rgba(0,0,0,0.7)] animate-slide-up flex flex-col">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <span className="block h-[5px] w-10 rounded-full bg-white/25" aria-hidden="true" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 border-b border-white/8 shrink-0">
            <div className="flex items-center gap-2">
              <Music2 className="h-4 w-4 text-amber-300" />
              <span className="text-sm font-semibold tracking-wide text-cream">
                Playlist
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] font-medium text-cream/50">
                {playlist.length}
              </span>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close playlist"
              className="grid h-8 w-8 place-items-center rounded-full text-cream/50 hover:bg-white/10 hover:text-cream active:scale-95 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable Track List */}
          <div className="flex-1 overflow-y-auto px-2 py-2 hide-scrollbar overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]">
            {trackList}
          </div>
        </div>
      </div>
    </>
  );
}
