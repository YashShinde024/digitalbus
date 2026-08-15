import { useEffect, useRef } from "react";
import type { Track } from "@/data/playlist";
import { FALLBACK_ARTWORK } from "@/data/playlist";
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

  // Auto-scroll active playing song into view when panel opens
  useEffect(() => {
    if (isOpen && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isOpen, currentTrackIndex]);

  // Click outside listener (desktop only — mobile uses backdrop)
  useEffect(() => {
    if (!isOpen) return;

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

  const renderTrackItem = (track: Track, idx: number) => {
    const isActive = idx === currentTrackIndex;

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
            ? "bg-white/12 text-cream shadow-inner"
            : "hover:bg-white/8 text-cream/75 hover:text-cream"
        }`}
      >
        {/* Accent bar for active track */}
        {isActive && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full bg-cream"
            aria-hidden="true"
          />
        )}

        {/* Track Artwork Thumbnail */}
        <div
          className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-black/40 border shadow-sm ${
            isActive ? "border-white/30" : "border-white/10"
          }`}
        >
          <img
            src={track.cover || FALLBACK_ARTWORK}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_ARTWORK;
            }}
            className="h-full w-full object-cover"
          />

          {/* Playing overlay indicator */}
          {isActive && isPlaying && (
            <span className="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-[1px]">
              <Volume2 className="h-4 w-4 text-cream animate-pulse" />
            </span>
          )}
        </div>

        {/* Track Details */}
        <div className="min-w-0 flex-1">
          <p
            className={`truncate text-[0.82rem] font-medium ${
              isActive ? "text-cream font-bold" : "text-cream"
            }`}
          >
            {track.title}
          </p>
          <p className="truncate text-[0.68rem] text-cream/50 mt-0.5">
            {track.artist}
            {track.album ? ` · ${track.album}` : ""}
          </p>
        </div>

        {/* Right: Year / Playing Badge */}
        <div className="shrink-0 text-right">
          {isActive ? (
            <span className="rounded-full bg-white/15 border border-white/25 px-2 py-0.5 text-[0.55rem] font-bold text-cream uppercase tracking-wider">
              Playing
            </span>
          ) : track.year ? (
            <span className="text-[0.62rem] font-medium text-cream/35">
              {track.year}
            </span>
          ) : null}
        </div>
      </button>
    );
  };

  return (
    <>
      {/* ──── DESKTOP: Popover Panel (≥640px) ──── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Playlist queue"
        aria-modal="true"
        className="glass-panel absolute bottom-[calc(100%+0.75rem)] left-0 right-0 z-[40]
          mx-auto h-[min(38vh,300px)] w-full max-w-[36rem] overflow-hidden
          rounded-[26px] border border-white/20 bg-ink/95 p-3.5 sm:p-4
          shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl animate-fade-in
          hidden sm:flex sm:flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-white/10 bg-transparent pb-3 px-1">
          <div className="flex items-center gap-2">
            <Music2 className="h-4 w-4 text-cream/80" />
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

        {/* Single cleanly scrollable list container */}
        <div className="mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 flex flex-col gap-1 hide-scrollbar">
          {playlist.map((track, idx) => renderTrackItem(track, idx))}
        </div>
      </div>

      {/* ──── MOBILE: Full-screen bottom sheet drawer (<640px) ──── */}
      <div className="fixed inset-0 z-[55] flex flex-col justify-end bg-black/75 backdrop-blur-md animate-fade-in sm:hidden">
        {/* Backdrop dismiss */}
        <div className="flex-1 w-full" onClick={onClose} />

        {/* Sheet Card */}
        <div className="relative w-full max-h-[82svh] rounded-t-[32px] border-t border-white/20 bg-ink/95 backdrop-blur-2xl shadow-[0_-16px_50px_rgba(0,0,0,0.8)] animate-slide-up flex flex-col">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2 shrink-0">
            <span className="block h-[5px] w-10 rounded-full bg-white/25" aria-hidden="true" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <Music2 className="h-4 w-4 text-cream/80" />
              <span className="text-sm font-semibold tracking-wide text-cream">
                Playlist
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.6rem] font-medium text-cream/60">
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
          <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2 hide-scrollbar overscroll-contain pb-[max(1.5rem,env(safe-area-inset-bottom))] flex flex-col gap-1">
            {playlist.map((track, idx) => renderTrackItem(track, idx))}
          </div>
        </div>
      </div>
    </>
  );
}
