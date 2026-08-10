import { useEffect, useState } from "react";

export function useClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) return { time: "", date: "" };

  const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toUpperCase();
  const date = now
    .toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase()
    .replace(/,?\s+/, ", ");

  return { time, date };
}
