import { createFileRoute, Link } from "@tanstack/react-router";
import { AtmosphereOverlay } from "@/components/digital-bus/AtmosphereOverlay";
import { RainEffect } from "@/components/digital-bus/RainEffect";
import { externalLinks, playlist } from "@/data/playlist";
import { Heart, ArrowLeft, Radio, Sparkles, Disc, Music } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Digital Bus — Nostalgic Hindi & Retro Bollywood Music Experience" },
      {
        name: "description",
        content:
          "Learn about Digital Bus, an immersive web-based listening experience built by Yash Shinde featuring nostalgic 90s & retro Bollywood music.",
      },
      { property: "og:title", content: "About Digital Bus — Nostalgic Hindi Radio" },
      {
        property: "og:description",
        content:
          "Digital Bus is an atmospheric web-based listening experience inspired by Indian bus journeys and nostalgic Hindi songs.",
      },
      { property: "og:url", content: "https://digitalbus.me/about" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="relative min-h-[100svh] w-full overflow-x-hidden bg-ink select-none text-cream">
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

          <span className="text-[0.62rem] font-bold tracking-[0.2em] text-cream/40 uppercase">
            ABOUT THE RIDE
          </span>
        </header>

        {/* Content Glass Cards Container */}
        <div className="my-8 flex flex-col gap-6">
          {/* Hero Section Card */}
          <section className="glass-panel relative flex flex-col items-center gap-4 rounded-[26px] border border-white/20 bg-ink/85 p-6 text-center shadow-2xl backdrop-blur-md sm:p-8">
            <h1 className="brand-mark font-display text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] flex flex-col items-center leading-[0.85]">
              <span className="text-[2.8rem] sm:text-[4.2rem]">डिजिटल</span>
              <span className="text-[3rem] sm:text-[4.5rem] -mt-1">बस</span>
            </h1>

            <p className="text-[0.58rem] font-bold uppercase tracking-[0.6em] text-cream/40 sm:text-[0.64rem]">
              <span className="ml-[0.6em]">DIGITAL BUS</span>
            </p>

            <blockquote className="my-1 border-y border-white/10 py-3 font-display text-[1.1rem] italic tracking-wide text-cream/90 sm:text-[1.25rem]">
              "More than a playlist. A little ride through memories."
            </blockquote>

            <p className="text-[0.82rem] leading-relaxed text-cream/75 sm:text-[0.88rem]">
              Digital Bus is an immersive web-based listening experience built around nostalgic Hindi and Bollywood music. It is designed for those moments when you put on your headphones, watch the road pass by, and let the music take you somewhere.
            </p>
          </section>

          {/* The Idea & Experience Cards Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Section 1: The Idea */}
            <section className="glass-panel flex flex-col gap-3 rounded-[22px] border border-white/15 bg-ink/80 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-cream/90">
                <Radio className="h-4 w-4 text-cream/70" />
                <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-cream/80">
                  THE IDEA
                </h2>
              </div>
              <p className="text-[0.78rem] leading-relaxed text-cream/65">
                Digital Bus combines handpicked nostalgic music, a cinematic bus journey, atmospheric monsoon visuals, and simple, uninterrupted radio listening.
              </p>
            </section>

            {/* Section 2: The Music */}
            <section className="glass-panel flex flex-col gap-3 rounded-[22px] border border-white/15 bg-ink/80 p-5 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 text-cream/90">
                <Music className="h-4 w-4 text-cream/70" />
                <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-cream/80">
                  THE MUSIC
                </h2>
              </div>
              <p className="text-[0.78rem] leading-relaxed text-cream/65">
                The playlist contains {playlist.length} nostalgic Hindi and retro Bollywood tracks. Songs are shuffled uniquely for each listener so every session feels like a new journey.
              </p>
            </section>
          </div>

          {/* Section 3: The Experience */}
          <section className="glass-panel flex flex-col gap-3 rounded-[22px] border border-white/15 bg-ink/80 p-5 sm:p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 text-cream/90">
              <Disc className="h-4 w-4 text-cream/70" />
              <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-cream/80">
                THE EXPERIENCE
              </h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[0.76rem] text-cream/70">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cream/40" />
                <span>Randomized listening queue</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cream/40" />
                <span>Automatic next-song playback</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cream/40" />
                <span>High quality album artwork</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cream/40" />
                <span>Ambient monsoon rain layer</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cream/40" />
                <span>Responsive 60fps music player</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cream/40" />
                <span>Keyboard shortcuts (B & X)</span>
              </li>
            </ul>
          </section>

          {/* Section 4: The Person Behind The Ride */}
          <section className="glass-panel flex flex-col items-center gap-3 rounded-[22px] border border-white/15 bg-ink/80 p-6 text-center shadow-xl backdrop-blur-md">
            <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cream/40 uppercase">
              THE PERSON BEHIND THE RIDE
            </span>
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
            <p className="max-w-md text-[0.78rem] leading-relaxed text-cream/65">
              Designed and built by Yash — a developer who enjoys turning ideas into experiences.
            </p>
          </section>

          {/* Section 5: The Next Stop */}
          <section className="glass-panel flex flex-col items-center gap-4 rounded-[22px] border border-white/20 bg-ink/90 p-6 text-center shadow-2xl backdrop-blur-md">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[0.58rem] font-bold tracking-[0.2em] text-cream/40 uppercase flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-amber-300" /> THE NEXT STOP
              </span>
              <h3 className="font-display text-[1.2rem] text-cream">Want more nostalgic music?</h3>
            </div>
            <p className="text-[0.76rem] text-cream/65 max-w-sm">
              Discover deeper nostalgic Hindi mixes, classic tracks, and retro music on Xpert Melody.
            </p>
            <a
              href={externalLinks.xpertMelody}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-xs font-semibold text-cream transition-all duration-200 hover:border-white/40 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
            >
              <span>Visit Xpert Melody</span>
              <span>↗</span>
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
            <span>•</span>
            <a
              href="https://nyxen.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              nyxen.in ↗
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
