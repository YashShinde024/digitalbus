import { useCallback, useEffect, useRef, useState } from "react";
import { playBusHorn } from "@/lib/audioEffects";

export function BrandTitle() {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle 5-click Easter Egg
  const handleTitleClick = useCallback(() => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      playBusHorn();
      setToastMessage("अरे! बस रोक क्यों दी? 🚌");
      setTimeout(() => setToastMessage(null), 3000);
    }
  }, []);

  // Handle Keyboard 'B' Key Horn Easter Egg
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "b" || e.key === "B") {
        playBusHorn();
        setToastMessage("🚌 *POOP-POOP!*");
        setTimeout(() => setToastMessage(null), 1500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative select-none text-center flex flex-col items-center">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="absolute -top-10 z-50 animate-bounce rounded-full border border-white/20 bg-black/80 px-3 py-1 text-xs font-medium text-cream shadow-lg backdrop-blur-md">
          {toastMessage}
        </div>
      )}

      {/* Large Stacked Hero Hindi Wordmark */}
      <button
        type="button"
        onClick={handleTitleClick}
        aria-label="Digital Bus brand title (Click 5 times for easter egg)"
        className="group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40 rounded-2xl"
      >
        <h1 className="brand-mark font-display text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center tracking-[0.02em] leading-[0.85] transition-transform duration-200 group-hover:scale-[1.01]">
          <span className="text-[3.2rem] sm:text-[4.8rem] lg:text-[6rem] block">डिजिटल</span>
          <span className="text-[3.4rem] sm:text-[5.2rem] lg:text-[6.5rem] block -mt-1 sm:-mt-2">
            बस
          </span>
        </h1>
      </button>

      {/* Refined English Subtitle */}
      <p className="mt-2.5 sm:mt-3 text-[0.52rem] font-semibold uppercase tracking-[0.6em] text-cream/45 sm:text-[0.62rem] sm:tracking-[0.7em]">
        <span className="ml-[0.6em] inline-block">Digital Bus</span>
      </p>
    </div>
  );
}
