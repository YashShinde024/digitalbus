import { useEffect, useState } from "react";
import { getOnlineCount } from "@/lib/presence";

export function OnlineStatus() {
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    setCount(getOnlineCount());
    const interval = setInterval(() => {
      setCount(getOnlineCount());
    }, 8000);

    return () => clearInterval(interval);
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
