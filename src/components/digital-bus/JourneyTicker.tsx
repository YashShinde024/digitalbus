import { useEffect, useState } from "react";

const MESSAGES = [
  "आज रास्ता थोड़ा लंबा है...",
  "कुछ सफ़र मंज़िल से ज़्यादा याद रहते हैं...",
  "खिड़की के बाहर दुनिया, कानों में एक कहानी...",
  "जहाँ रास्ते ख़त्म नहीं होते, बस बदलते हैं...",
  "थोड़ा रुकिए... सफ़र अभी बाकी है।",
  "कुछ गाने रास्तों के लिए बने होते हैं...",
  "बारिश हो, रास्ता हो, और एक अच्छा गाना...",
  "अगला पड़ाव — कहीं खूबसूरत।",
  "कुछ रास्ते मंज़िल से बेहतर होते हैं",
  "मंज़िल की जल्दी नहीं...",
];

/**
 * Random Journey Messages Micro-Ticker
 * Displays subtle, rotating poetic travel phrases to deepen the Indian bus journey atmosphere.
 * Rotates every ~30 seconds with a calm crossfade. Respects prefers-reduced-motion.
 */
export function JourneyTicker() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * MESSAGES.length));
  const [fade, setFade] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) {
      setReducedMotion(true);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (reducedMotion) {
        // Skip animation, just swap
        setIndex((prev) => (prev + 1) % MESSAGES.length);
      } else {
        setFade(false);
        setTimeout(() => {
          setIndex((prev) => (prev + 1) % MESSAGES.length);
          setFade(true);
        }, 600);
      }
    }, 30000); // Rotate every 30 seconds — calm pace

    return () => clearInterval(interval);
  }, [reducedMotion]);

  return (
    <div className="select-none text-center py-1">
      <p
        className={`text-[0.7rem] sm:text-xs font-medium tracking-[0.1em] text-cream/50 italic transition-opacity duration-600 ${
          fade ? "opacity-100" : "opacity-0"
        } ${reducedMotion ? "!transition-none" : ""}`}
      >
        "{MESSAGES[index]}"
      </p>
    </div>
  );
}
