import { useEffect, useState } from "react";

/**
 * Toast Banner Overlay for B-Key shortcut & title easter egg
 * Smoothly fades in right above the music player where it does not overlap header or player controls.
 */
export function ToastBanner() {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("shhhhh... enjoy the music 🤫");

  const showToast = (msg = "shhhhh... enjoy the music 🤫") => {
    setMessage(msg);
    setActive(true);
    setTimeout(() => {
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
        showToast("shhhhh... enjoy the music 🤫");
      }
    };

    (window as unknown as { triggerToastBanner?: (msg?: string) => void }).triggerToastBanner =
      showToast;

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      delete (window as unknown as { triggerToastBanner?: (msg?: string) => void })
        .triggerToastBanner;
    };
  }, []);

  return (
    <div
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ease-out transform ${
        active
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 translate-y-1 pointer-events-none"
      }`}
    >
      <div className="glass-panel flex items-center gap-2 rounded-full border border-white/20 bg-ink/85 px-4 py-1.5 text-xs font-medium text-cream/90 shadow-lg backdrop-blur-md">
        <span>{message}</span>
      </div>
    </div>
  );
}
