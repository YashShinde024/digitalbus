import { useEffect, useState } from "react";

/**
 * Toast Banner Overlay for B-Key shortcut & title interactions
 * Displays a subtle, elegant travel message ("shhhhh... enjoy the music 🤫")
 * without interrupting audio playback or triggering loud sounds.
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

      if (e.repeat) return; // Prevent repeated key hold triggering

      if (e.key === "b" || e.key === "B") {
        showToast("shhhhh... enjoy the music 🤫");
      }
    };

    // Expose window trigger for 5-click easter egg
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
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-400 ease-out transform ${
        active
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-20 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="glass-panel flex items-center gap-2.5 rounded-full border border-white/20 bg-ink/90 px-4 py-2 text-xs sm:text-sm font-medium text-cream shadow-lg backdrop-blur-md">
        <span>{message}</span>
      </div>
    </div>
  );
}
