import { useEffect, useState, useRef, useCallback } from "react";
import { externalLinks } from "@/data/playlist";
import { X } from "lucide-react";

/**
 * Xpert Melody Promotional Glassmorphic Card
 * Appears approximately once every 60 minutes of active listening time.
 * Can be toggled on/off at any time via the 'X' / 'x' keyboard shortcut.
 * Designed with responsive viewport positioning, safe area insets, and zero player overlap.
 */
export function XpertPromo() {
  const [visible, setVisible] = useState(false);
  const visibleRef = useRef(false);
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  const showPromo = useCallback(() => {
    setVisible(true);
    visibleRef.current = true;

    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
    }

    dismissTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      visibleRef.current = false;
    }, 8500); // 8.5 seconds clean display duration
  }, []);

  const hidePromo = useCallback(() => {
    setVisible(false);
    visibleRef.current = false;
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let activeListenTime = 0;
    try {
      const saved = localStorage.getItem("digital_bus_active_listen_time");
      if (saved) {
        activeListenTime = parseInt(saved, 10) || 0;
      }
    } catch {
      // Ignore
    }

    const interval = setInterval(() => {
      // Active tab check
      const isTabVisible = document.visibilityState === "visible";
      // Audio playing check
      const audio = (window as unknown as { digitalBusAudio?: HTMLAudioElement }).digitalBusAudio;
      const isPlaying = audio && !audio.paused;

      if (isTabVisible && isPlaying && !visibleRef.current) {
        activeListenTime += 1;
        try {
          localStorage.setItem("digital_bus_active_listen_time", String(activeListenTime));
        } catch {
          // Ignore
        }

        let threshold = 3600; // 60 minutes threshold
        try {
          if (localStorage.getItem("digital_bus_promo_test_mode") === "true") {
            threshold = 5;
          }
        } catch {
          // Ignore
        }

        if (activeListenTime >= threshold) {
          const isToastActive = (window as unknown as { isToastBannerActive?: boolean })
            .isToastBannerActive;

          if (isToastActive) {
            setTimeout(() => {
              if (!visibleRef.current) showPromo();
            }, 4000);
          } else {
            showPromo();
          }

          activeListenTime = 0;
          try {
            localStorage.setItem("digital_bus_active_listen_time", "0");
          } catch {
            // Ignore
          }
        }
      }
    }, 1000);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore typing inside inputs, textareas, or contenteditable elements
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      if (e.repeat) return;

      if (e.key === "x" || e.key === "X") {
        if (visibleRef.current) {
          hidePromo();
        } else {
          showPromo();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }
    };
  }, [showPromo, hidePromo]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed z-[60] transition-all duration-300 ease-out transform
        bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 sm:left-8 sm:right-auto sm:bottom-24
        w-[calc(100vw-1.5rem)] sm:w-[310px] max-w-[320px] mx-auto sm:mx-0
        motion-reduce:transition-none
        ${
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
    >
      <div className="glass-panel relative flex flex-col gap-2.5 rounded-[20px] border border-white/20 bg-ink/95 p-3.5 shadow-2xl backdrop-blur-md">
        {/* Close Button with generous touch target */}
        <button
          type="button"
          onClick={hidePromo}
          className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-cream/50 transition-colors hover:bg-white/10 hover:text-cream focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40 active:scale-95"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col gap-0.5 pr-7">
          <span className="text-[0.55rem] font-bold tracking-[0.2em] text-cream/40 uppercase flex items-center gap-1.5">
            <span>🚌</span> NEXT STOP
          </span>
          <h2 className="font-display text-[1.05rem] tracking-wide text-cream leading-tight">
            XPERT MELODY
          </h2>
        </div>

        <p className="text-[0.7rem] leading-relaxed text-cream/65">
          More nostalgic Hindi songs await on Xpert Melody.
        </p>

        {/* CTA Link */}
        <a
          href={externalLinks.xpertMelody}
          target="_blank"
          rel="noopener noreferrer"
          onClick={hidePromo}
          className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 text-[0.7rem] font-semibold text-cream transition-all duration-200 hover:border-white/35 hover:bg-white/20 active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
          aria-label="Explore Xpert Melody channel (opens in new tab)"
        >
          Explore Xpert Melody ↗
        </a>
      </div>
    </div>
  );
}
