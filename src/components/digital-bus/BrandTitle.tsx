import { useCallback, useRef } from "react";

export function BrandTitle() {
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle 5-click Easter Egg
  const handleTitleClick = useCallback(() => {
    clickCountRef.current += 1;

    if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      const triggerFn = (window as unknown as { triggerToastBanner?: (msg?: string) => void })
        .triggerToastBanner;
      if (triggerFn) {
        triggerFn("अरे! बस रोक क्यों दी? 🚌");
      }
    }
  }, []);

  return (
    <div className="relative select-none text-center flex flex-col items-center">
      {/* Large Stacked Hero Hindi Wordmark (Reduced weight & scale slightly for better composition) */}
      <button
        type="button"
        onClick={handleTitleClick}
        aria-label="Digital Bus brand title (Click 5 times for easter egg)"
        className="group cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/45 rounded-2xl"
      >
        <h1 className="brand-mark font-display text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center tracking-[0.01em] leading-[0.9] transition-transform duration-200 group-hover:scale-[1.01]">
          <span className="text-[2.6rem] sm:text-[3.8rem] lg:text-[4.8rem] block">डिजिटल</span>
          <span className="text-[2.8rem] sm:text-[4.2rem] lg:text-[5.2rem] block -mt-1 sm:-mt-2">
            बस
          </span>
        </h1>
      </button>

      {/* Refined English Subtitle */}
      <p className="mt-2 text-[0.5rem] font-bold uppercase tracking-[0.5em] text-cream/40 sm:text-[0.58rem] sm:tracking-[0.6em]">
        <span className="ml-[0.5em] inline-block">Digital Bus</span>
      </p>
    </div>
  );
}
