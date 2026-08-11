import { useEffect, useState, useRef } from "react";

/**
 * Toast Banner Overlay for B-Key shortcut & title easter egg
 * Positioned to avoid overlapping the central player, headers, or footers.
 */
export function ToastBanner() {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("Shhhhh... enjoy the music 🎧");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as unknown as { isToastBannerActive?: boolean }).isToastBannerActive = active;
    }
    return () => {
      if (typeof window !== "undefined") {
        delete (window as unknown as { isToastBannerActive?: boolean }).isToastBannerActive;
      }
    };
  }, [active]);

  const showToast = (msg = "Shhhhh... enjoy the music 🎧") => {
    setMessage(msg);
    setActive(true);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setActive(false);
    }, 2400);
  };

  useEffect(() => {
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

      if (e.key === "b" || e.key === "B") {
        showToast("Shhhhh... enjoy the music 🎧");
      }
    };

    (window as unknown as { triggerToastBanner?: (msg?: string) => void }).triggerToastBanner =
      showToast;

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      delete (window as unknown as { triggerToastBanner?: (msg?: string) => void })
        .triggerToastBanner;
    };
  }, []);

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-out transform ${
        active
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-1 pointer-events-none"
      } top-28 left-1/2 -translate-x-1/2 sm:top-auto sm:bottom-8 sm:right-8 sm:left-auto sm:translate-x-0`}
    >
      <div className="glass-panel flex items-center gap-2 rounded-full border border-white/20 bg-ink/85 px-4 py-1.5 text-xs font-medium text-cream/90 shadow-lg backdrop-blur-md">
        <span>{message}</span>
      </div>
    </div>
  );
}
