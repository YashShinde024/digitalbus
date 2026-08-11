import { useEffect, useState } from "react";
import { pingPresence, disconnectPresence } from "@/lib/presence";

// Fetch or generate a unique persistent client ID to prevent tab-inflation
const getOrCreateClientId = (): string => {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("digital_bus_user_id");
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem("digital_bus_user_id", id);
  }
  return id;
};

export function OnlineStatus() {
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    const clientId = getOrCreateClientId();
    if (!clientId) return;

    let isMounted = true;

    const ping = async () => {
      try {
        const res = await pingPresence({ data: { clientId } });
        if (isMounted && res && typeof res.onlineCount === "number") {
          setCount(res.onlineCount);
        }
      } catch (err) {
        // Gracefully ignore presence check errors to prevent breaking the core app/player
        console.warn("Presence ping failed, using fallback:", err);
      }
    };

    // Initial ping
    ping();

    // Poll every 10 seconds
    const interval = setInterval(ping, 10000);

    // Attempt clean disconnect on tab unload
    const handleUnload = () => {
      disconnectPresence({ data: { clientId } }).catch(() => {});
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <p className="flex flex-wrap items-center justify-center gap-1.5 text-[0.62rem] font-medium tracking-[0.14em] text-cream/45 sm:text-[0.68rem]">
      <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-online opacity-40" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-online/90" />
      </span>
      <span>{count} online</span>
      <span className="text-cream/25">•</span>
      <span className="text-cream/45 italic">Next stop: somewhere beautiful</span>
    </p>
  );
}
