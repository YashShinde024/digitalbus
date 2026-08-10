const BARS = [
  0.3, 0.55, 0.35, 0.8, 0.45, 0.95, 0.65, 0.4, 0.75, 0.5, 0.85, 0.35, 0.6, 0.45, 0.75, 0.35,
];

type Props = {
  active: boolean;
  loading?: boolean;
};

/**
 * Small decorative audio spectrum indicator positioned directly under song metadata.
 * Slightly animates when playing, remains static when paused/loading.
 */
export function AudioWaveform({ active, loading = false }: Props) {
  const isAnimating = active && !loading;

  return (
    <div className="flex h-4 items-center gap-[2.5px] max-w-[110px]" aria-hidden="true">
      {BARS.map((h, i) => (
        <span
          key={i}
          className={`w-[2px] rounded-full bg-cream/50 transition-[opacity,background-color] duration-300 ${
            isAnimating ? "animate-wave bg-cream/80" : "opacity-40"
          }`}
          style={{
            height: `${Math.max(3, h * 14)}px`,
            animationDelay: `${(i * 0.1) % 0.8}s`,
            animationDuration: `${1.4 + ((i * 7) % 5) * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}
