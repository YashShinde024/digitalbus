import { createFileRoute, Link } from "@tanstack/react-router";
import { AtmosphereOverlay } from "@/components/digital-bus/AtmosphereOverlay";
import { RainEffect } from "@/components/digital-bus/RainEffect";
import { externalLinks, playlist } from "@/data/playlist";
import { Heart, ArrowLeft, Radio, Sparkles, Disc, Music, User, Zap, Coffee } from "lucide-react";

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://digitalbus.me/about#aboutpage",
  url: "https://digitalbus.me/about",
  name: "About Digital Bus — The Story Behind the Ride",
  description:
    "Digital Bus is an immersive web-based listening experience built around nostalgic Hindi and Bollywood music. Designed and built by Yash Shinde.",
  isPartOf: {
    "@id": "https://digitalbus.me/#website",
  },
  about: {
    "@type": "WebApplication",
    name: "Digital Bus",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "All",
    description:
      "A cinematic web-based music player featuring nostalgic Hindi songs, atmospheric rain, and an Indian bus journey atmosphere.",
  },
  author: {
    "@type": "Person",
    name: "Yash Shinde",
    url: "https://yashshinde.is-a.dev",
  },
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Digital Bus — About the Journey | Nostalgic Hindi & Bollywood Music" },
      {
        name: "description",
        content:
          "Discover the story behind Digital Bus — an immersive web-based listening experience built around nostalgic Hindi and Bollywood music. Designed by Yash Shinde as a small experiment in turning a music player into an atmosphere.",
      },
      {
        property: "og:title",
        content: "Digital Bus — About the Journey",
      },
      {
        property: "og:description",
        content:
          "The story behind Digital Bus — a cinematic Hindi music experience inspired by Indian bus journeys, monsoon rain, and nostalgic old Bollywood songs.",
      },
      { property: "og:url", content: "https://digitalbus.me/about" },
      { property: "og:image", content: "https://digitalbus.me/og-image.png" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Digital Bus" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Digital Bus — About the Journey",
      },
      {
        name: "twitter:description",
        content:
          "The story behind Digital Bus — a cinematic Hindi music experience inspired by Indian bus journeys, monsoon rain, and nostalgic old Bollywood songs.",
      },
      { name: "twitter:image", content: "https://digitalbus.me/og-image.png" },
    ],
    links: [{ rel: "canonical", href: "https://digitalbus.me/about" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(aboutJsonLd),
      },
    ],
  }),
  component: AboutPage,
});

/* ──── Small atmospheric journey quotes used as section dividers ──── */
const journeyQuotes = [
  "कुछ सफ़र मंज़िल से ज़्यादा याद रहते हैं...",
  "बारिश हो, रास्ता हो, और एक अच्छा गाना...",
  "अगला पड़ाव — कहीं खूबसूरत।",
];

function SectionDivider({ quote, stopNumber }: { quote?: string; stopNumber?: number }) {
  return (
    <div className="flex flex-col items-center gap-2 py-2" aria-hidden="true">
      {stopNumber && (
        <div className="flex items-center gap-2 text-cream/25">
          <span className="h-px w-8 bg-cream/15" />
          <span className="text-[0.55rem] font-bold tracking-[0.25em] uppercase">
            STOP {stopNumber}
          </span>
          <span className="h-px w-8 bg-cream/15" />
        </div>
      )}
      {quote && (
        <p className="text-[0.68rem] italic text-cream/35 tracking-wide">"{quote}"</p>
      )}
    </div>
  );
}

function AboutPage() {
  return (
    <main className="relative min-h-[100svh] w-full overflow-x-hidden overflow-y-auto hide-scrollbar bg-ink select-none text-cream">
      {/* 1. Signature Background Artwork */}
      <img
        src="/bus-stop-bg.jpg"
        alt="A vintage Indian bus parked by a river next to a bus stop sign at sunset"
        className="fixed inset-0 h-full w-full object-cover object-[center_45%] z-0 scale-105"
        fetchPriority="high"
        decoding="async"
      />

      {/* 2. Atmosphere & Rain Layers */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        <RainEffect />
      </div>
      <AtmosphereOverlay />
      <div className="scene-veil fixed inset-0 z-[3] pointer-events-none" aria-hidden="true" />
      <div className="grain-overlay fixed inset-0 z-[4] pointer-events-none" aria-hidden="true" />

      {/* 3. Main Interactive Container */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[42rem] flex-col justify-between px-4 py-6 sm:px-8 sm:py-10">
        {/* Top Back Navigation Bar */}
        <header className="w-full flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-ink/75 px-4 py-2 text-xs font-semibold text-cream/80 backdrop-blur-md transition-all duration-200 hover:border-white/35 hover:bg-white/12 hover:text-cream active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Back to Digital Bus</span>
          </Link>

          <span className="text-[0.55rem] sm:text-[0.62rem] font-bold tracking-[0.2em] text-cream/40 uppercase">
            ABOUT THE RIDE
          </span>
        </header>

        {/* Content Glass Cards Container */}
        <div className="my-8 flex flex-col gap-5">

          {/* ════════ HERO SECTION ════════ */}
          <section className="glass-panel relative flex flex-col items-center gap-4 rounded-[26px] border border-white/20 bg-ink/85 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8">
            <h1 className="brand-mark font-display text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] flex flex-col items-center leading-[0.85]">
              <span className="text-[2.8rem] sm:text-[4.2rem]">डिजिटल</span>
              <span className="text-[3rem] sm:text-[4.5rem] -mt-1">बस</span>
            </h1>

            <p className="text-[0.58rem] font-bold uppercase tracking-[0.6em] text-cream/40 sm:text-[0.64rem]">
              <span className="ml-[0.6em]">DIGITAL BUS</span>
            </p>

            <blockquote className="my-1 border-y border-white/10 py-3 font-display text-[1.1rem] italic tracking-wide text-cream/90 sm:text-[1.25rem]">
              "More than a playlist.<br />A little ride through memories."
            </blockquote>

            <p className="text-[0.82rem] leading-relaxed text-cream/70 sm:text-[0.88rem] max-w-md">
              Put on your headphones, watch the road pass by, and let the music take you somewhere.
            </p>
          </section>

          <SectionDivider stopNumber={1} quote={journeyQuotes[0]} />

          {/* ════════ THE IDEA ════════ */}
          <section className="glass-panel flex flex-col gap-3 rounded-[22px] border border-white/15 bg-ink/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-cream/90">
              <Radio className="h-4 w-4 text-cream/70" />
              <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-cream/80">
                THE IDEA
              </h2>
            </div>
            <p className="text-[0.8rem] leading-[1.75] text-cream/65">
              Digital Bus started as a small experiment — what if a music player didn't just play songs, but created an atmosphere?
            </p>
            <p className="text-[0.8rem] leading-[1.75] text-cream/60">
              Instead of simply pressing play and looking at a playlist, the experience is designed around the feeling of travelling somewhere — rain outside the window, familiar songs in your headphones, and a road that seems a little longer at night.
            </p>
            <p className="text-[0.8rem] leading-[1.75] text-cream/55">
              It's that small, specific feeling of sitting by the window on a long bus ride, watching the world move while something nostalgic plays quietly in your ears.
            </p>
          </section>

          <SectionDivider stopNumber={2} quote={journeyQuotes[1]} />

          {/* ════════ THE MUSIC ════════ */}
          <section className="glass-panel flex flex-col gap-3 rounded-[22px] border border-white/15 bg-ink/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-cream/90">
              <Music className="h-4 w-4 text-cream/70" />
              <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-cream/80">
                THE MUSIC
              </h2>
            </div>
            <p className="text-[0.8rem] leading-[1.75] text-cream/65">
              The playlist is built around nostalgic Hindi and Bollywood music — the kind of songs you might hear on a long drive, a rainy evening, or a quiet moment when you're thinking about someone. Old romantic songs, classic melodies from the '90s and 2000s, and voices that carry a whole generation of memories.
            </p>
            <p className="text-[0.8rem] leading-[1.75] text-cream/60">
              The current library has <strong className="text-cream/80">{playlist.length} tracks</strong>, and they're shuffled uniquely for each listener — so every time you visit, the ride feels a little different.
            </p>
          </section>

          {/* ════════ THE EXPERIENCE ════════ */}
          <section className="glass-panel flex flex-col gap-3 rounded-[22px] border border-white/15 bg-ink/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-cream/90">
              <Disc className="h-4 w-4 text-cream/70" />
              <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-cream/80">
                THE EXPERIENCE
              </h2>
            </div>
            <p className="text-[0.8rem] leading-[1.75] text-cream/65">
              Everything in Digital Bus is designed to make listening feel immersive without getting in the way. The player handles the details — you just press play.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[0.76rem] text-cream/65 mt-1">
              {[
                "Randomized listening queue",
                "Automatic next-song playback",
                "Local high-quality audio",
                "Embedded album artwork & metadata",
                "Responsive glassmorphism player",
                "Atmospheric monsoon rain",
                "Keyboard controls (Space, B, X, ←→)",
                "Mobile-first design",
                "Real-time online presence",
                "Day/night atmosphere",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cream/40" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>

          <SectionDivider stopNumber={3} quote={journeyQuotes[2]} />

          {/* ════════ THE PERSON BEHIND THE RIDE ════════ */}
          <section className="glass-panel flex flex-col items-center gap-4 rounded-[22px] border border-white/15 bg-ink/80 p-6 text-center shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-cream/50" />
              <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cream/40 uppercase">
                THE PERSON BEHIND THE RIDE
              </span>
            </div>
            <h3 className="font-display text-[1.25rem] text-cream flex items-center gap-2">
              <span>Built by</span>
              <a
                href="https://yashshinde.is-a.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-cream/30 underline-offset-4 hover:text-cream hover:decoration-cream transition-colors"
              >
                Yash
              </a>
              <Heart className="h-4 w-4 text-red-400 fill-red-400/40 inline" />
            </h3>
            <p className="max-w-md text-[0.8rem] leading-[1.75] text-cream/60">
              Digital Bus was designed and built by Yash Shinde — a developer and builder interested in full-stack products, AI, and turning small ideas into experiences. When he's not writing code, he's probably thinking about the next thing to build.
            </p>
            <a
              href="https://yashshinde.is-a.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-cream/70 hover:text-cream transition-colors"
            >
              More about Yash <span aria-hidden="true">↗</span>
            </a>
          </section>

          {/* ════════ BUILT UNDER THE SAME CURIOSITY — NYXEN ════════ */}
          <section className="flex flex-col items-center gap-3 rounded-[18px] border border-white/8 bg-ink/60 p-5 text-center backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-cream/40" />
              <span className="text-[0.58rem] font-bold tracking-[0.2em] text-cream/35 uppercase">
                BUILT UNDER THE SAME CURIOSITY
              </span>
            </div>
            <p className="text-[0.78rem] text-cream/50 max-w-sm leading-relaxed">
              Digital Bus is an independent experiment built by Yash. For more of the products and ideas behind the work:
            </p>
            <a
              href="https://nyxen.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-col items-center gap-0.5 group"
            >
              <span className="text-[0.9rem] font-semibold text-cream/75 group-hover:text-cream transition-colors tracking-wide">
                NYXEN
              </span>
              <span className="text-[0.62rem] text-cream/40 italic">
                Innovate. Build. Empower.
              </span>
            </a>
          </section>

          {/* ════════ THE NEXT STOP — XPERT MELODY ════════ */}
          <section className="glass-panel flex flex-col items-center gap-4 rounded-[22px] border border-white/20 bg-ink/90 p-6 text-center shadow-2xl backdrop-blur-md">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[0.58rem] font-bold tracking-[0.2em] text-cream/40 uppercase flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-300" /> THE NEXT STOP
              </span>
              <h3 className="font-display text-[1.2rem] text-cream">Still looking for something to listen to?</h3>
            </div>
            <p className="text-[0.78rem] text-cream/60 max-w-sm leading-relaxed">
              Explore Xpert Melody for more nostalgic songs, mixes, and music.
            </p>
            <a
              href={externalLinks.xpertMelody}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-xs font-semibold text-cream transition-all duration-200 hover:border-white/40 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
            >
              <span>Visit Xpert Melody</span>
              <span aria-hidden="true">↗</span>
            </a>
          </section>

          {/* ════════ SUPPORT ════════ */}
          <section className="flex flex-col items-center gap-2.5 py-4 text-center">
            <p className="text-[0.82rem] text-cream/55 font-medium">Enjoyed the ride?</p>
            <a
              href="https://www.thankyouverymuch.co/yash"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[0.75rem] font-medium text-cream/70 transition-all duration-200 hover:border-white/35 hover:bg-white/12 hover:text-cream active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
            >
              <Coffee className="h-3.5 w-3.5 text-cream/50 group-hover:text-cream transition-colors" />
              <span>Support the journey</span>
              <Heart className="h-3 w-3 text-red-400 fill-red-400/40" />
            </a>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 pt-4 text-[0.7rem] text-cream/50">
          <p>Digital Bus — Nostalgic Hindi Radio</p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.thankyouverymuch.co/yash"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              Support the journey
            </a>
            <span aria-hidden="true">•</span>
            <a
              href="https://nyxen.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              nyxen.in <span aria-hidden="true">↗</span>
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
