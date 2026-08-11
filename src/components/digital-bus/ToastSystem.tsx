import { useEffect, useState, useRef, useCallback } from "react";
import { externalLinks } from "@/data/playlist";
import { X } from "lucide-react";

type ToastType = "b_key" | "xpert_promo" | "custom_banner";

interface ActiveToast {
  type: ToastType;
  message?: string;
}

/**
 * Unified Floating Notification System for Digital Bus
 * Enforces a strict single-active-toast policy so notifications never stack, overlap,
 * or interfere with the central music player.
 */
export function ToastSystem() {
  const [activeToast, setActiveToast] = useState<ActiveToast | null>(null);
  const activeToastRef = useRef<ActiveToast | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    activeToastRef.current = activeToast;
    if (typeof window !== "undefined") {
      (window as unknown as { isToastBannerActive?: boolean }).isToastBannerActive =
        activeToast !== null;
    }
  }, [activeToast]);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
    activeToastRef.current = null;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const triggerToast = useCallback(
    (type: ToastType, message?: string, durationMs?: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setActiveToast({ type, message });

      const autoDismissTime = durationMs ?? (type === "xpert_promo" ? 8500 : 2400);
      timeoutRef.current = setTimeout(() => {
        dismissToast();
      }, autoDismissTime);
    },
    [dismissToast],
  );

  const toggleToast = useCallback(
    (type: ToastType, message?: string) => {
      if (activeToastRef.current?.type === type) {
        dismissToast();
      } else {
        triggerToast(type, message);
      }
    },
    [dismissToast, triggerToast],
  );

  // Hourly active listening timer for Xpert Melody promo
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
      const isTabVisible = document.visibilityState === "visible";
      const audio = (window as unknown as { digitalBusAudio?: HTMLAudioElement }).digitalBusAudio;
      const isPlaying = audio && !audio.paused;

      if (isTabVisible && isPlaying && !activeToastRef.current) {
        activeListenTime += 1;
        try {
          localStorage.setItem("digital_bus_active_listen_time", String(activeListenTime));
        } catch {
          // Ignore
        }

        let threshold = 3600; // 60 minutes
        try {
          if (localStorage.getItem("digital_bus_promo_test_mode") === "true") {
            threshold = 5;
          }
        } catch {
          // Ignore
        }

        if (activeListenTime >= threshold) {
          triggerToast("xpert_promo");
          activeListenTime = 0;
          try {
            localStorage.setItem("digital_bus_active_listen_time", "0");
          } catch {
            // Ignore
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [triggerToast]);

  // Expose toast triggers on window for centralized keyboard shortcuts & external callers
  useEffect(() => {
    const w = window as unknown as {
      triggerToastBanner?: (msg?: string) => void;
      digitalBusTriggerToast?: (type: string, message?: string) => void;
      digitalBusToggleToast?: (type: string, message?: string) => void;
    };

    w.triggerToastBanner = (msg) => {
      triggerToast("custom_banner", msg || "Shhhhh... enjoy the music 🎧");
    };

    w.digitalBusTriggerToast = (type: string, message?: string) => {
      triggerToast(type as ToastType, message);
    };

    w.digitalBusToggleToast = (type: string, message?: string) => {
      toggleToast(type as ToastType, message);
    };

    return () => {
      delete w.triggerToastBanner;
      delete w.digitalBusTriggerToast;
      delete w.digitalBusToggleToast;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [triggerToast, toggleToast]);

  if (!activeToast) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed z-[60] transition-all duration-300 ease-out transform
        bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 sm:left-8 sm:right-auto sm:bottom-24
        w-[calc(100vw-1.5rem)] sm:w-[320px] max-w-[320px] mx-auto sm:mx-0
        motion-reduce:transition-none"
    >
      {activeToast.type === "xpert_promo" ? (
        <div className="glass-panel relative flex flex-col gap-2.5 rounded-[20px] border border-white/20 bg-ink/95 p-3.5 shadow-2xl backdrop-blur-md">
          <button
            type="button"
            onClick={dismissToast}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-cream/50 transition-colors hover:bg-white/10 hover:text-cream focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40 active:scale-95"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" />
          </button>

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

          <a
            href={externalLinks.xpertMelody}
            target="_blank"
            rel="noopener noreferrer"
            onClick={dismissToast}
            className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 text-[0.7rem] font-semibold text-cream transition-all duration-200 hover:border-white/35 hover:bg-white/20 active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
            aria-label="Explore Xpert Melody channel (opens in new tab)"
          >
            Explore Xpert Melody ↗
          </a>
        </div>
      ) : (
        <div className="glass-panel flex items-center justify-between gap-2.5 rounded-full border border-white/20 bg-ink/90 px-4 py-2 text-xs font-medium text-cream/90 shadow-xl backdrop-blur-md">
          <span>{activeToast.message || "Shhhhh... enjoy the music 🎧"}</span>
          <button
            type="button"
            onClick={dismissToast}
            className="text-cream/40 hover:text-cream transition-colors p-0.5"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
