import { createFileRoute, Link } from "@tanstack/react-router";
import { AtmosphereOverlay } from "@/components/digital-bus/AtmosphereOverlay";
import { BackgroundScene } from "@/components/digital-bus/BackgroundScene";
import { externalLinks, playlist } from "@/data/playlist";
import {
  Heart,
  ArrowLeft,
  Radio,
  Sparkles,
  Disc,
  Music,
  User,
  Zap,
  Coffee,
  Globe,
  Code2,
  ShieldCheck,
  Keyboard,
  ExternalLink,
} from "lucide-react";
import { useEffect } from "react";

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://digitalbus.me/about#aboutpage",
      url: "https://digitalbus.me/about",
      name: "About Digital Bus — The Story Behind the Ride",
      description:
        "Digital Bus is an immersive web-based listening experience built around nostalgic Hindi and Bollywood music. Designed and crafted by Yash Shinde, founder of Nyxen.",
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
        sameAs: [
          "https://github.com/Yashshinde024",
          "https://x.com/yash_shinde_024",
          "https://www.linkedin.com/in/yash-shinde-393159309",
          "https://nyxen.in",
        ],
      },
    },
    {
      "@type": "Organization",
      "@id": "https://digitalbus.me/about#nyxen",
      name: "Nyxen",
      url: "https://nyxen.in",
      slogan: "Innovate. Build. Empower.",
      founder: {
        "@type": "Person",
        name: "Yash Shinde",
      },
    },
  ],
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Digital Bus — Nostalgic Hindi Radio & The Story Behind the Ride" },
      {
        name: "description",
        content:
          "Discover the story behind Digital Bus — an immersive listening experience built around nostalgic Hindi & 90s Bollywood music, crafted by Yash Shinde at Nyxen studio.",
      },
      {
        property: "og:title",
        content: "About Digital Bus — The Story Behind the Ride",
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
        content: "About Digital Bus — The Story Behind the Ride",
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

/* ──── Atmospheric journey quotes used as section dividers ──── */
const journeyQuotes = [
  "कुछ सफ़र मंज़िल से ज़्यादा याद रहते हैं...",
  "बारिश हो, खिड़की वाली सीट हो, और एक पुराना गाना...",
  "अगला पड़ाव — कहीं खूबसूरत।",
  "सफ़र जारी है...",
];

function SectionDivider({ quote, stopNumber }: { quote?: string; stopNumber?: number }) {
  return (
    <div className="flex flex-col items-center gap-1.5 py-1.5" aria-hidden="true">
      {stopNumber && (
        <div className="flex items-center gap-2 text-cream/30">
          <span className="h-px w-8 bg-cream/15" />
          <span className="text-[0.52rem] font-bold tracking-[0.25em] uppercase">
            STOP 0{stopNumber}
          </span>
          <span className="h-px w-8 bg-cream/15" />
        </div>
      )}
      {quote && (
        <p className="text-[0.68rem] italic text-cream/40 tracking-wide font-display text-center">
          "{quote}"
        </p>
      )}
    </div>
  );
}

function AboutPage() {
  // Enforce scrollbar hiding on body while on about page
  useEffect(() => {
    document.documentElement.classList.add("hide-scrollbar");
    document.body.classList.add("hide-scrollbar");
    return () => {
      document.documentElement.classList.remove("hide-scrollbar");
      document.body.classList.remove("hide-scrollbar");
    };
  }, []);

  return (
    <div className="fixed inset-0 h-[100svh] w-full overflow-x-hidden overflow-y-auto hide-scrollbar bg-ink select-none text-cream">
      {/* 1. Signature Background Artwork fixed in place with smooth crossfade */}
      <BackgroundScene fixed={true} />

      {/* 2. Atmosphere & Overlay Layers (Static across viewport) */}
      <AtmosphereOverlay fixed={true} />
      <div className="scene-veil fixed inset-0 z-[3] pointer-events-none" aria-hidden="true" />
      <div className="grain-overlay fixed inset-0 z-[4] pointer-events-none" aria-hidden="true" />

      {/* 3. Main Interactive Container */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[42rem] flex-col justify-between px-4 py-6 sm:px-8 sm:py-10">
        {/* Top Back Navigation Bar */}
        <header className="w-full flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-ink/80 px-4 py-2 text-xs font-semibold text-cream/85 backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/15 hover:text-cream active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50 shadow-lg"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Back to Digital Bus</span>
          </Link>

          <span className="text-[0.55rem] sm:text-[0.62rem] font-bold tracking-[0.2em] text-cream/45 uppercase border border-white/10 px-3 py-1 rounded-full bg-white/5 backdrop-blur-sm">
            ABOUT THE RIDE
          </span>
        </header>

        {/* Content Glass Cards Container */}
        <div className="my-8 flex flex-col gap-6">
          {/* ════════ HERO SECTION ════════ */}
          <section className="glass-panel relative flex flex-col items-center gap-4 rounded-[26px] border border-white/20 bg-black/60 p-6 text-center shadow-2xl backdrop-blur-2xl sm:p-8">
            <h1 className="brand-mark font-display text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] flex flex-col items-center leading-[0.85]">
              <span className="text-[2.8rem] sm:text-[4.2rem]">डिजिटल</span>
              <span className="text-[3rem] sm:text-[4.5rem] -mt-1">बस</span>
            </h1>

            <p className="text-[0.58rem] font-bold uppercase tracking-[0.6em] text-cream/45 sm:text-[0.64rem]">
              <span className="ml-[0.6em]">DIGITAL BUS • NOSTALGIC HINDI RADIO</span>
            </p>

            <blockquote className="my-1 border-y border-white/10 py-3.5 font-display text-[1.15rem] italic tracking-wide text-cream/90 sm:text-[1.35rem] max-w-md">
              "More than a playlist.
              <br />A little ride through memories."
            </blockquote>

            <p className="text-[0.82rem] leading-relaxed text-cream/70 sm:text-[0.88rem] max-w-md">
              Put on your headphones, watch the rain trickle down the window, and let timeless
              melodies take you on the long way home.
            </p>
          </section>

          <SectionDivider stopNumber={1} quote={journeyQuotes[0]} />

          {/* ════════ THE IDEA ════════ */}
          <section className="glass-panel flex flex-col gap-3.5 rounded-[24px] border border-white/20 bg-black/60 p-5 sm:p-6 shadow-xl backdrop-blur-2xl">
            <div className="flex items-center gap-2 text-cream/90 border-b border-white/10 pb-2.5">
              <Radio className="h-4 w-4 text-cream/80" />
              <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-cream/80">
                THE IDEA
              </h2>
            </div>
            <p className="text-[0.82rem] leading-[1.75] text-cream/70">
              Digital Bus started as a creative experiment:{" "}
              <strong className="text-cream font-medium">
                what if a music player didn't just play audio files, but created an immersive
                atmosphere?
              </strong>
            </p>
            <p className="text-[0.82rem] leading-[1.75] text-cream/65">
              Instead of an endless algorithmic queue or flat list, everything here is designed
              around the tactile feeling of an Indian bus journey — raindrops sliding down glass,
              streetlights casting warm glows in the dark, and unforgettable Hindi melodies playing
              quietly in your ears.
            </p>
            <p className="text-[0.82rem] leading-[1.75] text-cream/60">
              It captures that quiet, cherished feeling of claiming the window seat on a night bus,
              watching the world drift by outside while you drift somewhere far in memory.
            </p>
          </section>

          <SectionDivider stopNumber={2} quote={journeyQuotes[1]} />

          {/* ════════ THE MUSIC ════════ */}
          <section className="glass-panel flex flex-col gap-3.5 rounded-[24px] border border-white/20 bg-black/60 p-5 sm:p-6 shadow-xl backdrop-blur-2xl">
            <div className="flex items-center gap-2 text-cream/90 border-b border-white/10 pb-2.5">
              <Music className="h-4 w-4 text-cream/80" />
              <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-cream/80">
                THE MUSIC & CURATION
              </h2>
            </div>
            <p className="text-[0.82rem] leading-[1.75] text-cream/70">
              The soundtrack is built from the golden era of Hindi and retro Bollywood cinema —
              romantic ballads, rainy melodies, and travel anthems from legendary voices like{" "}
              <span className="text-cream font-medium">
                Kumar Sanu, Alka Yagnik, Udit Narayan, Sonu Nigam, Kishore Kumar, and Lata
                Mangeshkar
              </span>
              .
            </p>
            <p className="text-[0.82rem] leading-[1.75] text-cream/65">
              Currently featuring{" "}
              <strong className="text-cream font-semibold">{playlist.length} curated tracks</strong>{" "}
              with embedded high-resolution artwork. Every listening session is shuffled uniquely,
              ensuring that no two journeys on Digital Bus feel quite the same.
            </p>

            {/* Streaming Links Row */}
            <div className="mt-2 flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
              <span className="text-[0.62rem] font-semibold text-cream/45 uppercase tracking-wider mr-1">
                Also streaming on:
              </span>
              <a
                href={externalLinks.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-medium text-cream/75 hover:bg-white/15 hover:text-cream transition-all"
              >
                Spotify <ExternalLink className="h-2.5 w-2.5 text-cream/40" />
              </a>
              <a
                href={externalLinks.youtubeMusic}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-medium text-cream/75 hover:bg-white/15 hover:text-cream transition-all"
              >
                YouTube Music <ExternalLink className="h-2.5 w-2.5 text-cream/40" />
              </a>
              <a
                href={externalLinks.appleMusic}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-medium text-cream/75 hover:bg-white/15 hover:text-cream transition-all"
              >
                Apple Music <ExternalLink className="h-2.5 w-2.5 text-cream/40" />
              </a>
            </div>
          </section>

          {/* ════════ THE CRAFT & FEATURES ════════ */}
          <section className="glass-panel flex flex-col gap-3.5 rounded-[24px] border border-white/20 bg-black/60 p-5 sm:p-6 shadow-xl backdrop-blur-2xl">
            <div className="flex items-center gap-2 text-cream/90 border-b border-white/10 pb-2.5">
              <Disc className="h-4 w-4 text-cream/80" />
              <h2 className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-cream/80">
                FEATURES & DESIGN DETAILS
              </h2>
            </div>
            <p className="text-[0.82rem] leading-[1.75] text-cream/70">
              Built with React 19, Vite, TanStack Start, and custom glassmorphism styling designed
              for effortless listening on both mobile and desktop.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[0.78rem] text-cream/70 mt-1">
              {[
                "Randomized listening queue & auto-next",
                "Single persistent audio engine (zero glitch)",
                "Interactive glassmorphic bus ticket sharing",
                "Subtle monsoon rain & atmospheric lighting",
                "Ambient bus road audio toggle",
                "Live real-time passenger presence tracking",
                "Mobile compact player with swipe gestures",
                "Zero telemetry, cookies, or account friction",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cream/50" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Keyboard Shortcuts Table */}
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-cream/80 mb-2.5">
                <Keyboard className="h-3.5 w-3.5 text-cream/60" />
                <span className="text-[0.62rem] font-bold uppercase tracking-wider text-cream/60">
                  KEYBOARD SHORTCUTS
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[0.7rem]">
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[0.62rem] font-mono text-cream">
                    Space
                  </kbd>
                  <span className="text-cream/50">Play/Pause</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[0.62rem] font-mono text-cream">
                    N / P
                  </kbd>
                  <span className="text-cream/50">Next/Prev</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[0.62rem] font-mono text-cream">
                    Q
                  </kbd>
                  <span className="text-cream/50">Queue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[0.62rem] font-mono text-cream">
                    T
                  </kbd>
                  <span className="text-cream/50">Ticket</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[0.62rem] font-mono text-cream">
                    M
                  </kbd>
                  <span className="text-cream/50">Mute</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[0.62rem] font-mono text-cream">
                    S
                  </kbd>
                  <span className="text-cream/50">Shuffle</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[0.62rem] font-mono text-cream">
                    ← / →
                  </kbd>
                  <span className="text-cream/50">Seek 5s</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="rounded border border-white/20 bg-white/10 px-1.5 py-0.5 text-[0.62rem] font-mono text-cream">
                    B
                  </kbd>
                  <span className="text-cream/50">Secret</span>
                </div>
              </div>
            </div>
          </section>

          <SectionDivider stopNumber={3} quote={journeyQuotes[2]} />

          {/* ════════ THE CREATOR — YASH SHINDE ════════ */}
          <section className="glass-panel flex flex-col items-center gap-4 rounded-[24px] border border-white/20 bg-black/60 p-6 text-center shadow-xl backdrop-blur-2xl">
            <div className="flex items-center gap-2">
              <User className="h-3.5 w-3.5 text-cream/50" />
              <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cream/45 uppercase">
                THE PERSON BEHIND THE RIDE
              </span>
            </div>

            <h3 className="font-display text-[1.4rem] text-cream flex items-center gap-2">
              <span>Crafted by</span>
              <a
                href="https://yashshinde.is-a.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-cream/40 underline-offset-4 hover:text-white hover:decoration-cream transition-colors font-semibold"
              >
                Yash Shinde
              </a>
              <Heart className="h-4 w-4 text-red-400 fill-red-400/40 inline" />
            </h3>

            <p className="max-w-md text-[0.82rem] leading-[1.75] text-cream/65">
              Yash is a Python Developer and Full-Stack Web Engineer specializing in Django,
              FastAPI, React, and TypeScript. He is the founder of{" "}
              <strong className="text-cream font-medium">Nyxen</strong>, focused on engineering
              scalable backend systems, AI-powered products, and thoughtful web applications
              designed with deep aesthetic care.
            </p>

            {/* Social & Portfolio Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <a
                href="https://yashshinde.is-a.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.72rem] font-medium text-cream hover:bg-white/20 transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Portfolio</span>
                <ExternalLink className="h-2.5 w-2.5 text-cream/50" />
              </a>

              <a
                href="https://github.com/Yashshinde024"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.72rem] font-medium text-cream hover:bg-white/20 transition-colors"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>GitHub</span>
                <ExternalLink className="h-2.5 w-2.5 text-cream/50" />
              </a>

              <a
                href="https://x.com/yash_shinde_024"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[0.72rem] font-medium text-cream hover:bg-white/20 transition-colors"
              >
                <span>X / Twitter</span>
                <ExternalLink className="h-2.5 w-2.5 text-cream/50" />
              </a>
            </div>
          </section>

          {/* ════════ NYXEN PRODUCT STUDIO ════════ */}
          <section className="glass-panel flex flex-col gap-4 rounded-[24px] border border-white/20 bg-black/60 p-5 sm:p-6 shadow-xl backdrop-blur-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cream/80" />
                <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cream/50 uppercase">
                  THE STUDIO • NYXEN
                </span>
              </div>
              <a
                href="https://nyxen.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-cream/80 hover:text-white transition-colors"
              >
                nyxen.in <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <p className="text-[0.82rem] leading-[1.75] text-cream/70">
              <strong className="text-cream font-semibold">Nyxen</strong> is an independent digital
              product studio founded by Yash Shinde with the motto{" "}
              <em className="text-cream">"Innovate. Build. Empower."</em> Nyxen creates
              consumer-focused technology, AI utilities, and software that people love using every
              day — free from corporate bloat, VC overhead, and telemetry tracking.
            </p>

            {/* Sister Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <a
                href="https://venzai.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 transition-all hover:bg-white/10 hover:border-white/25"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-300" />
                    <h4 className="text-[0.88rem] font-bold text-cream group-hover:text-white">
                      Venz AI
                    </h4>
                  </div>
                  <span className="rounded-full bg-white/10 border border-white/20 px-2 py-0.2 text-[0.55rem] font-semibold text-cream/90 uppercase">
                    Live
                  </span>
                </div>
                <p className="text-[0.72rem] text-cream/60 leading-relaxed">
                  AI workspace focused on prompt optimization, deterministic workflows, and
                  multi-model playgrounds.
                </p>
                <span className="text-[0.65rem] font-medium text-cream/40 group-hover:text-cream/80 mt-auto pt-1 flex items-center gap-1">
                  venzai.tech ↗
                </span>
              </a>

              <a
                href="https://nychat.app"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 transition-all hover:bg-white/10 hover:border-white/25"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    <h4 className="text-[0.88rem] font-bold text-cream group-hover:text-white">
                      NyChat
                    </h4>
                  </div>
                  <span className="rounded-full bg-white/10 border border-white/20 px-2 py-0.2 text-[0.55rem] font-semibold text-cream/90 uppercase">
                    Live
                  </span>
                </div>
                <p className="text-[0.72rem] text-cream/60 leading-relaxed">
                  Login-free encrypted anonymous conversational platform with instant ephemeral
                  messaging tunnels.
                </p>
                <span className="text-[0.65rem] font-medium text-cream/40 group-hover:text-cream/80 mt-auto pt-1 flex items-center gap-1">
                  nychat.app ↗
                </span>
              </a>
            </div>

            {/* Studio Ethos Badges */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/8 text-[0.68rem] text-cream/55 font-light">
              <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5">
                ✦ 100% Independent
              </span>
              <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5">
                ✦ Zero Tracking Mandate
              </span>
              <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5">
                ✦ Built in Public
              </span>
            </div>
          </section>

          <SectionDivider stopNumber={4} quote={journeyQuotes[3]} />

          {/* ════════ THE NEXT STOP — XPERT MELODY ════════ */}
          <section className="glass-panel flex flex-col items-center gap-3.5 rounded-[24px] border border-white/20 bg-ink/90 p-6 text-center shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[0.58rem] font-bold tracking-[0.2em] text-cream/45 uppercase flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-cream/80" /> THE NEXT STOP
              </span>
              <h3 className="font-display text-[1.25rem] text-cream">
                Looking for more musical journeys?
              </h3>
            </div>
            <p className="text-[0.8rem] text-cream/65 max-w-sm leading-relaxed">
              Explore Xpert Melody for more nostalgic Hindi songs, retro remixes, and musical
              collections.
            </p>
            <a
              href={externalLinks.xpertMelody}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 text-xs font-semibold text-cream transition-all duration-200 hover:border-white/40 hover:bg-white/20 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50 shadow-lg"
            >
              <span>Visit Xpert Melody</span>
              <span aria-hidden="true">↗</span>
            </a>
          </section>

          {/* ════════ SUPPORT ════════ */}
          <section className="flex flex-col items-center gap-2.5 py-4 text-center">
            <p className="text-[0.82rem] text-cream/60 font-medium">Enjoyed the ride?</p>
            <a
              href="https://www.thankyouverymuch.co/yash"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/8 px-4 py-2 text-[0.75rem] font-medium text-cream/80 transition-all duration-200 hover:border-white/40 hover:bg-white/15 hover:text-cream active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50 shadow-md"
            >
              <Coffee className="h-3.5 w-3.5 text-cream/60 group-hover:text-cream transition-colors" />
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
              href="https://yashshinde.is-a.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream transition-colors"
            >
              Yash Shinde <span aria-hidden="true">↗</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
