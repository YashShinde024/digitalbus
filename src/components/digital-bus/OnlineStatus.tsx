import { useEffect, useState } from "react";
import { pingPresence } from "@/lib/presence";

export function OnlineStatus() {
  const [onlineCount, setOnlineCount] = useState<number>(1);

  useEffect(() => {
    // Generate an anonymous unique client ID per session/tab
    let clientId = "";
    try {
      clientId = sessionStorage.getItem("digital_bus_client_id") || "";
      if (!clientId) {
        clientId =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessionStorage.setItem("digital_bus_client_id", clientId);
      }
    } catch {
      clientId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    const sendPing = () => {
      pingPresence({ data: { clientId } })
        .then((res) => {
          if (res && typeof res.onlineCount === "number") {
            setOnlineCount(res.onlineCount);
          }
        })
        .catch(() => {
          // Fall back gracefully to 1 if network request fails
          setOnlineCount((c) => Math.max(1, c));
        });
    };

    // Send initial presence ping
    sendPing();

    // Heartbeat every 10 seconds to maintain presence
    const interval = setInterval(sendPing, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <p className="flex items-center justify-center gap-1.5 text-[0.62rem] font-medium tracking-[0.14em] text-cream/45 sm:text-[0.68rem]">
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-online opacity-40" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-online/90" />
      </span>
      <span>{onlineCount} online</span>
      <span className="text-cream/25">•</span>
      <span className="text-cream/40">currently riding</span>
    </p>
  );
}
