import { useEffect, useState, useRef } from "react";
import { externalLinks } from "@/data/playlist";
import { X } from "lucide-react";

export function XpertPromo() {
  const [visible, setVisible] = useState(false);
  const dismissTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

      if (isTabVisible && isPlaying && !visible) {
        activeListenTime += 1;
        try {
          localStorage.setItem("digital_bus_active_listen_time", String(activeListenTime));
        } catch {
          // Ignore
        }

        // 60 minutes threshold (3600 seconds)
        // Allows testing override via localStorage flag
        const threshold =
          localStorage.getItem("digital_bus_promo_test_mode") === "true" ? 5 : 3600;

        if (activeListenTime >= threshold) {
          const isToastActive = (window as unknown as { isToastBannerActive?: boolean })
            .isToastBannerActive;

          if (isToastActive) {
            // Delay showing by 4 seconds to prevent clash
            setTimeout(() => {
              showPromo();
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

    const showPromo = () => {
      setVisible(true);

      if (dismissTimeoutRef.current) {
        clearTimeout(dismissTimeoutRef.current);
      }

      dismissTimeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, 7500); // 7.5 seconds display time
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent triggering while user is typing in input, textarea, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      if (e.repeat) return;

      if (e.key === "x" || e.key === "X") {
        showPromo();
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
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
  };

  const handleCtaClick = () => {
    setVisible(false);
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed z-50 transition-all duration-500 ease-out transform bottom-8 left-8 max-w-[300px] w-[88%] sm:w-[300px] 
        max-sm:bottom-auto max-sm:top-48 max-sm:left-1/2 max-sm:-translate-x-1/2
        motion-reduce:transition-none
        ${
          visible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none"
        }`}
    >
      <div className="glass-panel relative flex flex-col gap-3 rounded-[20px] border border-white/20 bg-ink/90 p-4 shadow-2xl backdrop-blur-md">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-3.5 top-3.5 text-cream/45 hover:text-cream transition-colors p-1 rounded-full hover:bg-white/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40"
          aria-label="Dismiss announcement"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Content */}
        <div className="flex flex-col gap-1 pr-6">
          <span className="text-[0.58rem] font-bold tracking-[0.2em] text-cream/40 uppercase flex items-center gap-1.5">
            <span>🚌</span> NEXT STOP
          </span>
          <h2 className="font-display text-[1.1rem] tracking-wide text-cream leading-tight">
            XPERT MELODY
          </h2>
        </div>

        <p className="text-[0.72rem] leading-relaxed text-cream/60">
          The ride doesn't end here.<br />
          More nostalgic music awaits.
        </p>

        {/* CTA Link */}
        <a
          href={externalLinks.xpertMelody}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleCtaClick}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 py-1.5 text-[0.7rem] font-semibold text-cream/85 transition-all duration-200 hover:border-white/35 hover:bg-white/12 hover:text-cream active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
          aria-label="Explore Xpert Melody channel (opens in new tab)"
        >
          Explore Xpert Melody ↗
        </a>
      </div>
    </div>
  );
}
