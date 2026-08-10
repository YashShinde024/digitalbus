import { useEffect, useState } from "react";
import { playBusHorn } from "@/lib/audioEffects";

/**
 * Animated Bus Horn Banner Overlay
 * When 'B' key is pressed or triggered via title click,
 * a vintage glassmorphic Indian Bus banner slides down from top of screen!
 */
export function BusHornBanner() {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("🚌 PAA-PAAAN! • साइड दो भाई! 📣");

  const triggerHorn = (msg = "🚌 PAA-PAAAN! • साइड दो भाई! 📣") => {
    playBusHorn();
    setMessage(msg);
    setActive(true);
    setTimeout(() => {
      setActive(false);
    }, 2800);
  };

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
        const messages = [
          "🚌 PAA-PAAAN! • साइड दो भाई! 📣",
          "🚌 HORN OK PLEASE! • रास्ता साफ़ है 💨",
          "🚌 PAA-PAAAN! • पहाडी बस आ गई! 🌄",
          "🚌 PAA-PAAAN! • ओवरटेक मत करो! 🚨",
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)]!;
        triggerHorn(randomMsg);
      }
    };

    // Expose global window function so BrandTitle can trigger it too
    (window as unknown as { triggerBusHornBanner?: (msg?: string) => void }).triggerBusHornBanner =
      triggerHorn;

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      delete (window as unknown as { triggerBusHornBanner?: (msg?: string) => void })
        .triggerBusHornBanner;
    };
  }, []);

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out transform ${
        active
          ? "translate-y-0 opacity-100 scale-100"
          : "-translate-y-24 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="glass-panel flex items-center gap-3 rounded-full border border-yellow-400/40 bg-ink/90 px-5 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(250,204,21,0.25)]">
        {/* Animated Headlight Indicator */}
        <span className="relative flex h-3 w-3 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-400" />
        </span>

        {/* Banner Message */}
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-cream drop-shadow">
          {message}
        </p>
      </div>
    </div>
  );
}
