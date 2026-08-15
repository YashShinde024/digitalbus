import { useCallback, useEffect, useState } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { AtmosphereOverlay } from "./AtmosphereOverlay";
import { BackgroundScene } from "./BackgroundScene";
import { BrandTitle } from "./BrandTitle";
import { Clock } from "./Clock";
import { Footer } from "./Footer";
import { JourneyTicker } from "./JourneyTicker";
import { MusicLinks } from "./MusicLinks";
import { MusicPlayer } from "./MusicPlayer";
import { OnlineStatus } from "./OnlineStatus";
import { ToastSystem } from "./ToastSystem";

export function DigitalBus() {
  useKeyboardShortcuts();
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [playerExpanded, setPlayerExpanded] = useState(false);

  // Listen for mobile player expansion state changes
  const handlePlayerExpand = useCallback((e: Event) => {
    const detail = (e as CustomEvent<{ expanded: boolean }>).detail;
    setPlayerExpanded(detail.expanded);
  }, []);

  useEffect(() => {
    window.addEventListener("digitalbus:playerexpand", handlePlayerExpand);
    return () => window.removeEventListener("digitalbus:playerexpand", handlePlayerExpand);
  }, [handlePlayerExpand]);

  // Subtle Mouse Parallax on Desktop
  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      setParallax({ x: dx * 6, y: dy * 4 });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Transition classes for content that fades when mobile player expands
  const mobileContentFade = playerExpanded
    ? "max-sm:opacity-0 max-sm:translate-y-2 max-sm:pointer-events-none"
    : "max-sm:opacity-100 max-sm:translate-y-0";

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-ink select-none">
      {/* Unified Floating Toast Notification Manager */}
      <ToastSystem />

      {/* 1. Background artwork rotating with smooth crossfade & desktop mouse parallax */}
      <BackgroundScene parallax={parallax} />

      {/* 2. Automatic Day/Night Time Atmosphere & Scene Veil */}
      <AtmosphereOverlay />
      <div className="scene-veil absolute inset-0 z-[3] pointer-events-none" aria-hidden="true" />
      <div
        className="grain-overlay absolute inset-0 z-[4] pointer-events-none"
        aria-hidden="true"
      />

      {/* 3. Main Interactive UI Layer */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-3.5 pb-[max(5.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-9 sm:pb-6 sm:pt-6">
        {/* Header */}
        <header className="relative w-full">
          {/* Desktop Center Focal Hero Wordmark — Anchored to exact viewport 50% center */}
          <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 top-0 flex-col items-center gap-1.5 text-center pointer-events-auto z-10">
            <BrandTitle />
            <OnlineStatus />
          </div>

          <div className="flex items-start justify-between gap-3 w-full">
            {/* Top Left Corner: Time, Day, Date */}
            <div className="shrink-0 text-left">
              <Clock />
            </div>

            {/* Top Right Corner: Spotify, YouTube Music, Apple Music */}
            <div className="shrink-0 flex justify-end items-start">
              <MusicLinks />
            </div>
          </div>

          {/* Mobile Center Brand Title */}
          <div className="mt-3 flex flex-col items-center gap-1 text-center sm:hidden">
            <BrandTitle />
            <OnlineStatus />
          </div>
        </header>

        {/* Mobile: flexible spacer to reveal scenic bus view */}
        <div className="flex-1 sm:hidden min-h-[40px]" aria-hidden="true" />

        {/* Lower-Center Floating Glass Music Player Container */}
        <div className="mx-auto w-full max-w-[36rem] py-2 sm:py-3 mt-auto mb-1.5 sm:mb-3 flex flex-col gap-1.5">
          <div className={mobileContentFade}>
            <JourneyTicker />
          </div>
          <MusicPlayer />
        </div>

        {/* Footer System */}
        <div className={`w-full pt-1 transition-all duration-300 ${mobileContentFade}`}>
          <Footer />
        </div>
      </div>
    </main>
  );
}
