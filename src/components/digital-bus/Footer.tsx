import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-between gap-3 text-[0.68rem] font-medium tracking-[0.06em] text-cream/50 sm:flex-row sm:text-[0.72rem]">
      {/* Creator Attribution */}
      <p className="flex items-center gap-1 text-center sm:text-left">
        <span>Crafted for the journey by</span>
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

      {/* Support & Nyxen links */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5">
        <a
          href="https://www.thankyouverymuch.co/yash"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-cream/75 transition-all duration-200 hover:border-white/35 hover:bg-white/12 hover:text-cream focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
          aria-label="Support the journey on Thank You Very Much (opens in new tab)"
        >
          <Heart className="h-3 w-3 text-red-400 fill-red-400/40 transition-transform duration-200 group-hover:scale-110" />
          <span>Support the journey</span>
        </a>

        <a
          href="https://nyxen.in"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded text-cream/65 transition-colors duration-200 hover:text-cream focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
        >
          nyxen.in <span aria-hidden="true">↗</span>
        </a>
      </div>
    </footer>
  );
}
