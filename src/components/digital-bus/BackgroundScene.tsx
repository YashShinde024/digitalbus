import { useEffect, useState } from "react";

const BACKGROUNDS = [
  {
    src: "/backgrounds/bus-bg-1.jpg",
    alt: "Maharashtra ST bus at sunset overlooking Khandala ghat mountains and river",
    location: "Khandala Ghat",
  },
  {
    src: "/backgrounds/bus-bg-2.jpg",
    alt: "Maharashtra ST bus driving through lush green hills near Bhor during golden hour",
    location: "Bhor",
  },
  {
    src: "/backgrounds/bus-bg-3.jpg",
    alt: "Maharashtra ST bus by a tranquil mountain lake on a clear sunny day",
    location: "Koyna Lake",
  },
  {
    src: "/backgrounds/bus-bg-4.jpg",
    alt: "Maharashtra ST bus under blooming purple jacaranda trees beside scenic valley",
    location: "Satara Valley",
  },
];

// Interval in milliseconds to crossfade to the next scenic background (every 2.5 minutes)
const ROTATION_INTERVAL_MS = 150000;

export function BackgroundScene({
  parallax = { x: 0, y: 0 },
  fixed = false,
}: {
  parallax?: { x: number; y: number };
  fixed?: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load the next background image progressively before rotation rather than downloading all 4 at once on initial paint
  useEffect(() => {
    // Preload next image in sequence
    const nextIdx = (currentIndex + 1) % BACKGROUNDS.length;
    const nextBg = BACKGROUNDS[nextIdx];
    if (nextBg) {
      const img = new Image();
      img.src = nextBg.src;
    }
  }, [currentIndex]);

  // Automatic background rotation timer with smooth crossfade
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, ROTATION_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`${fixed ? "fixed" : "absolute"} inset-0 z-0 overflow-hidden select-none pointer-events-none bg-black`}
    >
      {BACKGROUNDS.map((bg, idx) => {
        const isActive = idx === currentIndex;
        return (
          <img
            key={bg.src}
            src={bg.src}
            alt={bg.alt}
            fetchPriority={idx === 0 ? "high" : "low"}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-[center_45%] transition-opacity duration-[2000ms] ease-in-out will-change-[opacity,transform] ${
              isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
            }`}
            style={{
              transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) scale(1.04)`,
              transitionProperty: "opacity, transform",
              transitionDuration: "2000ms, 400ms",
              transitionTimingFunction: "ease-in-out, ease-out",
            }}
          />
        );
      })}
    </div>
  );
}
