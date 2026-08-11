import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { playlist } from "../data/playlist";
import { RainEffect } from "../components/digital-bus/RainEffect";
import { AtmosphereOverlay } from "../components/digital-bus/AtmosphereOverlay";

import appCss from "../styles.css?url";

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://digitalbus.me/#website",
      url: "https://digitalbus.me/",
      name: "Digital Bus",
      alternateName: "डिजिटल बस",
      description:
        "Digital Bus is a nostalgic Hindi and retro Bollywood listening experience for old Hindi songs, 90s Bollywood music, romantic classics, and Indian bus journey road-trip playlists.",
      publisher: {
        "@id": "https://digitalbus.me/#person",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://digitalbus.me/#webpage",
      url: "https://digitalbus.me/",
      name: "Digital Bus — Nostalgic Hindi Travel Playlist",
      isPartOf: { "@id": "https://digitalbus.me/#website" },
      about: "A cinematic Indian bus radio for old Hindi songs, retro Bollywood playlists, 90s Hindi songs, and nostalgic road trip music.",
    },
    {
      "@type": "WebApplication",
      "@id": "https://digitalbus.me/#webapp",
      url: "https://digitalbus.me/",
      name: "Digital Bus Radio",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript and HTML5 Audio",
    },
    {
      "@type": "Person",
      "@id": "https://digitalbus.me/#person",
      name: "Yash Shinde",
      url: "https://yashshinde.is-a.dev",
      sameAs: ["https://nyxen.in", "https://www.thankyouverymuch.co/yash"],
    },
    {
      "@type": "MusicPlaylist",
      "@id": "https://digitalbus.me/#playlist",
      name: "Nostalgic Hindi & Retro Bollywood Playlist — Digital Bus",
      description: "The Indian Bus Driver's Playlist: classic old Hindi songs, 90s Bollywood hits, retro romantic Hindi music, relaxing travel songs, and nostalgic bus journey music for long road trips and night travel.",
      numTracks: playlist.length,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: playlist.map((track, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "MusicRecording",
            name: track.title,
            byArtist: track.artist,
            inAlbum: track.album,
            datePublished: track.year ? String(track.year) : undefined,
            url: `https://digitalbus.me/?song=${track.id}`,
            image: `https://digitalbus.me${track.cover}`,
          },
        })),
      },
      track: playlist.map((track, index) => ({
        "@type": "MusicRecording",
        name: track.title,
        position: index + 1,
        url: `https://digitalbus.me${track.audio}`,
        image: `https://digitalbus.me${track.cover}`,
        byArtist: {
          "@type": "MusicGroup",
          name: track.artist,
        },
        inAlbum: track.album ? {
          "@type": "MusicAlbum",
          name: track.album,
        } : undefined,
      })),
    },
  ],
};

function NotFoundComponent() {
  return (
    <main className="relative min-h-[100svh] w-full overflow-hidden bg-ink select-none flex items-center justify-center p-4">
      {/* 1. Background artwork */}
      <img
        src="/bus-stop-bg.jpg"
        alt="A vintage Indian bus parked by a river next to a bus stop sign at sunset"
        className="absolute inset-0 h-full w-full object-cover object-[center_45%] z-0 scale-105"
        fetchPriority="high"
        decoding="async"
      />

      {/* 2. Background Rain Atmosphere (Strictly behind UI) */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <RainEffect />
      </div>

      {/* 3. Automatic Day/Night Time Atmosphere & Scene Veil */}
      <AtmosphereOverlay />
      <div className="scene-veil absolute inset-0 z-[3] pointer-events-none" aria-hidden="true" />
      <div
        className="grain-overlay absolute inset-0 z-[4] pointer-events-none"
        aria-hidden="true"
      />

      {/* 4. Glass Card Container */}
      <div className="relative z-10 w-full max-w-[28rem] text-center">
        <div className="glass-panel relative flex flex-col items-center gap-6 rounded-[26px] border border-white/20 bg-ink/80 p-8 shadow-2xl backdrop-blur-md">
          {/* Header */}
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[0.6rem] font-bold tracking-[0.2em] text-cream/40 uppercase">
              DIGITAL BUS
            </span>
            <h1 className="font-display text-[3.6rem] sm:text-[4.5rem] tracking-wide text-cream leading-none">
              404
            </h1>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <h2 className="text-[1.05rem] font-semibold text-cream leading-tight">
              "Looks like this ride took a wrong turn."
            </h2>
            <p className="text-[0.78rem] text-cream/55 leading-relaxed">
              The stop you're looking for doesn't exist.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col w-full gap-3 mt-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 py-2.5 text-[0.8rem] font-semibold text-cream transition-all duration-200 hover:border-white/35 hover:bg-white/12 active:scale-98 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
            >
              Back to Digital Bus
            </Link>
            <a
              href="https://nyxen.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 text-[0.7rem] font-medium text-cream/55 hover:text-cream transition-colors py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
            >
              Take me somewhere beautiful ↗
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Digital Bus — Old Hindi & Bollywood Songs for the Long Way Home" },
      {
        name: "description",
        content:
          "Step inside the cozy cabin of Digital Bus. Stream nostalgic 90s & 2000s Bollywood songs, old Hindi romantic classics, and retro love melodies to make your drive beautiful.",
      },
      {
        name: "keywords",
        content:
          "old Hindi songs, old Bollywood songs, 90s Hindi songs, 90s Bollywood songs, 2000s Hindi songs, nostalgic Hindi songs, Hindi retro music, Bollywood nostalgia, romantic old Hindi songs, Kumar Sanu songs, Udit Narayan songs, Alka Yagnik songs, Sonu Nigam songs, 90s romantic songs, Hindi songs to listen to online, nostalgic music player, old Hindi music playlist, retro Bollywood playlist, Hindi love songs, relaxing Hindi songs, songs for long drives, nostalgic songs for travelling, rainy day Hindi songs, old Bollywood playlist, Digital Bus",
      },
      { name: "author", content: "Yash Shinde" },
      { name: "publisher", content: "Yash Shinde" },
      { name: "theme-color", content: "#191512" },
      { name: "robots", content: "index, follow" },
      {
        property: "og:title",
        content: "Digital Bus — Old Hindi & Bollywood Songs for the Long Way Home",
      },
      {
        property: "og:description",
        content:
          "Step inside the cozy cabin of Digital Bus. Stream nostalgic 90s & 2000s Bollywood songs, old Hindi romantic classics, and retro love melodies to make your drive beautiful.",
      },
      { property: "og:url", content: "https://digitalbus.me/" },
      { property: "og:image", content: "https://digitalbus.me/og-image.png" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Digital Bus" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Digital Bus — Old Hindi & Bollywood Songs for the Long Way Home",
      },
      {
        name: "twitter:description",
        content:
          "Step inside the cozy cabin of Digital Bus. Stream nostalgic 90s & 2000s Bollywood songs, old Hindi romantic classics, and retro love melodies to make your drive beautiful.",
      },
      { name: "twitter:image", content: "https://digitalbus.me/og-image.png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLdData),
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "canonical", href: "https://digitalbus.me/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Yatra+One&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
