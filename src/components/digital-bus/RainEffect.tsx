import { useEffect, useRef } from "react";

interface Drop {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
}

/**
 * Cinematic Monsoon Rain & Mist Effect
 * High-performance 60fps HTML5 Canvas rain layer that sits behind the UI
 * and respects prefers-reduced-motion & page visibility.
 */
export function RainEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check prefers-reduced-motion
    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) return;

    let animFrameId: number;
    let width = 0;
    let height = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Generate ~60-90 rain drops (scaled appropriately for screen width)
    const dropCount = Math.min(100, Math.max(40, Math.floor(width / 15)));
    const drops: Drop[] = [];

    for (let i = 0; i < dropCount; i++) {
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 14 + Math.random() * 18,
        speed: 10 + Math.random() * 12,
        opacity: 0.12 + Math.random() * 0.22,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render rain drops
      ctx.strokeStyle = "rgba(235, 240, 245, 0.4)";
      ctx.lineWidth = 1.2;
      ctx.lineCap = "round";

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i]!;

        ctx.beginPath();
        ctx.strokeStyle = `rgba(235, 240, 245, ${drop.opacity})`;
        ctx.moveTo(drop.x, drop.y);
        // Slanted monsoon rain angle
        ctx.lineTo(drop.x - drop.length * 0.25, drop.y + drop.length);
        ctx.stroke();

        // Move drop down & slightly left
        drop.y += drop.speed;
        drop.x -= drop.speed * 0.25;

        // Reset when drop leaves screen
        if (drop.y > height + 20) {
          drop.y = -20;
          drop.x = Math.random() * (width + 100);
        }
      }

      animFrameId = requestAnimationFrame(render);
    };

    // Pause animation loop if user switches tabs to save CPU/battery
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId);
      } else {
        animFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    animFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Canvas Rain Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" />
      {/* Subtle Atmospheric Mist Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/15 via-transparent to-ink/25 pointer-events-none" />
    </div>
  );
}
