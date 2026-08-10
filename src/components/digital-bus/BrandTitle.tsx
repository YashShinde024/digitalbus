export function BrandTitle() {
  return (
    <div className="select-none text-center flex flex-col items-center">
      {/* Large Stacked Hero Hindi Wordmark with subtle soft shadow */}
      <h1 className="brand-mark font-display text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center tracking-[0.02em] leading-[0.85]">
        <span className="text-[3.2rem] sm:text-[4.8rem] lg:text-[6rem] block">
          डिजिटल
        </span>
        <span className="text-[3.4rem] sm:text-[5.2rem] lg:text-[6.5rem] block -mt-1 sm:-mt-2">
          बस
        </span>
      </h1>

      {/* Refined English Subtitle */}
      <p className="mt-2.5 sm:mt-3 text-[0.52rem] font-semibold uppercase tracking-[0.6em] text-cream/45 sm:text-[0.62rem] sm:tracking-[0.7em]">
        <span className="ml-[0.6em] inline-block">Digital Bus</span>
      </p>
    </div>
  );
}
