import { useEffect, useState } from "react";
import { AtmosphereOverlay } from "./AtmosphereOverlay";
import { BrandTitle } from "./BrandTitle";
import { BusHornBanner } from "./BusHornBanner";
import { Clock } from "./Clock";
import { Footer } from "./Footer";
import { JourneyTicker } from "./JourneyTicker";
import { MusicLinks } from "./MusicLinks";
import { MusicPlayer } from "./MusicPlayer";
import { OnlineStatus } from "./OnlineStatus";
import { RainEffect } from "./RainEffect";

export function DigitalBus() {
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

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

  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-ink select-none">
      {/* Top Sliding Bus Horn Banner */}
      <BusHornBanner />

      {/* 1. Background artwork with subtle desktop mouse parallax */}
      <img
        src="/bus-stop-bg.jpg"
        alt="A vintage Indian bus parked by a river next to a bus stop sign at sunset"
        className="absolute inset-0 h-full w-full object-cover object-[center_45%] z-0 transition-transform duration-300 ease-out scale-105"
        style={{
          transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) scale(1.05)`,
        }}
        fetchPriority="high"
        decoding="async"
      />

      {/* 2. Background Rain Atmosphere (Strictly behind UI) */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <RainEffect />
      </div>

      {/* 3. Automatic Day/Night Time Atmosphere & Scene Veil */}
      <AtmosphereOverlay />
      <div className="scene-veil absolute inset-0 z-[3] pointer-events-none" aria-hidden="true" />
      <div
        className="grain-overlay absolute inset-0 z-[4] pointer-events-none"
        aria-hidden="true"
      />

      {/* 4. Main Interactive UI Layer */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-between px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:px-9 sm:pb-6 sm:pt-6">
        {/* Header - Viewport Centered Stacked Brand Title */}
        <header className="relative w-full">
          <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-6">
            <Clock />

            {/* Desktop Center Focal Hero Wordmark */}
            <div className="hidden sm:flex flex-col items-center gap-1.5 text-center">
              <BrandTitle />
              <OnlineStatus />
            </div>

            <div className="flex justify-end">
              <MusicLinks />
            </div>
          </div>

          {/* Mobile Header Title */}
          <div className="mt-1 flex flex-col items-center gap-1.5 text-center sm:hidden">
            <BrandTitle />
            <OnlineStatus />
          </div>
        </header>

        {/* Lower-Center Floating Glass Music Player Container */}
        <div className="mx-auto w-full max-w-[34rem] py-2 sm:py-3 mt-auto mb-2 sm:mb-3 flex flex-col gap-1.5">
          <JourneyTicker />
          <MusicPlayer />
        </div>

        {/* Footer System */}
        <div className="w-full pt-1">
          <Footer />
        </div>
      </div>
    </main>
  );
}
