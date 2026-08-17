import { Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <div className="flex w-full flex-col gap-2.5 sm:gap-3.5">
      {/* Subtle AEO/SEO context section */}
      <div className="w-full text-center text-[0.62rem] sm:text-[0.68rem] leading-relaxed text-cream/35 border-t border-white/5 pt-2.5 sm:pt-3.5">
        <p className="max-w-xl mx-auto hidden sm:block">
          <strong>Digital Bus</strong> is an immersive web-based listening experience playing a
          nostalgic collection of old Hindi and retro Bollywood songs. Specially curated for lovers
          of 90s Bollywood music, romantic old songs, and relaxing travel tracks.
        </p>
        <p className="max-w-xl mx-auto sm:hidden flex items-center justify-center gap-1.5 text-[0.62rem] text-cream/45">
          <span>Digital Bus — Nostalgic Hindi Radio</span>
          <span>•</span>
          <Link
            to="/about"
            className="text-cream/75 underline decoration-cream/30 hover:text-cream hover:decoration-cream"
          >
            About this ride ↗
          </Link>
        </p>
      </div>

      <footer className="flex w-full flex-col items-center justify-between gap-2.5 text-[0.68rem] font-medium tracking-[0.06em] text-cream/50 sm:flex-row sm:text-[0.72rem]">
        {/* Creator Attribution */}
        <p className="flex items-center gap-1.5 text-center sm:text-left">
          <span>Crafted for the long way home by</span>
          <a
            href="https://yashshinde.is-a.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-cream underline decoration-cream/30 underline-offset-2 transition-colors hover:text-cream hover:decoration-cream focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
          >
            Yash
          </a>
          <span aria-label="love">❤️</span>
        </p>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[0.68rem]">
          <Link
            to="/about"
            className="hidden sm:inline-block rounded text-cream/65 transition-colors duration-200 hover:text-cream focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
          >
            About
          </Link>

          <a
            href="https://www.thankyouverymuch.co/yash"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-cream/75 transition-all duration-200 hover:border-white/35 hover:bg-white/12 hover:text-cream active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
            aria-label="Support the journey on Thank You Very Much (opens in new tab)"
          >
            <Heart className="h-3 w-3 text-red-400 fill-red-400/40 transition-transform duration-200 group-hover:scale-110" />
            <span>Support the journey</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
