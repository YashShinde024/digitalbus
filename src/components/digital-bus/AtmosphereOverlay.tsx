import { useEffect, useState } from "react";

type TimeMode = "morning" | "day" | "evening" | "night";

function getTimeMode(): TimeMode {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return "morning";
  if (hour >= 10 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

/**
 * Dynamic Time-Based Atmosphere Overlay
 * Responds to the visitor's local hour (morning, day, golden evening, cinematic night)
 * using smooth CSS gradient overlays without modifying the original artwork file.
 */
export function AtmosphereOverlay({ fixed = false }: { fixed?: boolean } = {}) {
  const [mode, setMode] = useState<TimeMode>("evening");

  useEffect(() => {
    setMode(getTimeMode());
    const interval = setInterval(() => {
      setMode(getTimeMode());
    }, 60000); // Re-check every minute

    return () => clearInterval(interval);
  }, []);

  const getOverlayStyle = () => {
    switch (mode) {
      case "morning":
        return "bg-gradient-to-b from-amber-950/20 via-transparent to-amber-900/15 backdrop-brightness-[1.02]";
      case "day":
        return "bg-gradient-to-b from-amber-900/10 via-transparent to-black/10";
      case "evening":
        return "bg-gradient-to-b from-orange-950/25 via-amber-950/10 to-rose-950/30 backdrop-contrast-[1.03]";
      case "night":
        return "bg-gradient-to-b from-indigo-950/40 via-slate-950/25 to-slate-950/60 backdrop-brightness-[0.88]";
      default:
        return "bg-transparent";
    }
  };

  return (
    <div
      className={`pointer-events-none ${fixed ? "fixed" : "absolute"} inset-0 z-[2] transition-colors duration-1000 ${getOverlayStyle()}`}
      aria-hidden="true"
    />
  );
}
