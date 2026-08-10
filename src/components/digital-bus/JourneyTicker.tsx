import { useEffect, useState } from "react";

const MESSAGES = [
  "आज रास्ता थोड़ा लंबा है...",
  "अगला पड़ाव यादों के पास है",
  "खिड़की वाली सीट खाली है",
  "सफ़र जारी है...",
  "कुछ रास्ते मंज़िल से बेहतर होते हैं",
  "पहाड़ों के पार एक शाम...",
  "मंज़िल की जल्दी नहीं...",
];

/**
 * Random Journey Messages Micro-Ticker
 * Displays subtle, rotating poetic travel messages to deepen the Indian bus journey atmosphere.
 */
export function JourneyTicker() {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % MESSAGES.length);
        setFade(true);
      }, 500);
    }, 24000); // Rotate every 24 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="select-none text-center py-1">
      <p
        className={`text-[0.7rem] sm:text-xs font-medium tracking-[0.1em] text-cream/50 italic transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        "{MESSAGES[index]}"
      </p>
    </div>
  );
}
