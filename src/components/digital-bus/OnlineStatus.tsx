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
    <p className="flex flex-wrap items-center justify-center gap-1.5 text-[0.58rem] font-semibold tracking-[0.12em] text-cream/40 uppercase sm:text-[0.62rem]">
      <span className="relative inline-flex h-1.5 w-1.5 self-center" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-online opacity-30" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-online/85" />
      </span>
      <span>{count} online</span>
      <span className="text-cream/20 font-normal">•</span>
      <span className="text-cream/40 italic lowercase tracking-normal font-medium normal-case">
        Next stop: somewhere beautiful
      </span>
    </p>
  );
}
