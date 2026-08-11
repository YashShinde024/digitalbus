# Digital Bus

> An immersive web-based listening experience built around nostalgic Hindi and Bollywood music.

🌐 **Live:** [digitalbus.me](https://digitalbus.me)

---

## About

Digital Bus is a browser-based music experience designed around the feeling of travelling somewhere — rain outside the window, familiar songs in your headphones, and a road that seems a little longer at night.

Instead of being another music player with a playlist, Digital Bus turns listening into a small visual journey — combining a cinematic Indian bus-stop environment, atmospheric monsoon rain, and a glassmorphic music player into a single cohesive experience.

---

## Features

- 🚌 Immersive Digital Bus experience
- 🎵 Nostalgic Hindi & Bollywood music library
- 🎶 77-track curated collection
- 🔀 Per-user randomized playback
- ▶️ Automatic next-track playback
- 🖼️ Album artwork and embedded metadata via ID3 parsing
- 🪟 Glassmorphic music player with translucent glass UI
- 📱 Responsive UI across desktop, tablet, and mobile
- 🌧️ Ambient monsoon rain (HTML5 Canvas, 60fps)
- 🟢 Real-time online presence counter
- ⌨️ Keyboard controls (Space, B, X, ←, →)
- 🎧 Xpert Melody integration
- ❤️ Support integration
- 🔍 SEO / Open Graph / structured data optimization
- 🚫 Custom 404 page
- 📖 Dedicated About page

---

## Keyboard Controls

| Key | Action |
|-----|--------|
| `Space` | Play / Pause current song |
| `B` | "Shhhhh... enjoy the music 🎧" |
| `X` | Toggle Xpert Melody notification |
| `←` | Seek backward ~5 seconds |
| `→` | Seek forward ~5 seconds |

Shortcuts are disabled when typing in input fields. Space does not scroll the page when used as a player shortcut.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [TanStack Start](https://tanstack.com/start) (React meta-framework with SSR) |
| UI Library | [React 19](https://react.dev) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Bundler | [Vite 8](https://vite.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Audio | HTML5 Audio API + Web Audio API (synthesized horn & ambient engine) |
| Server | [Nitro](https://nitro.build/) (serverless functions for presence) |
| Icons | [Lucide React](https://lucide.dev/) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Deployment | [Vercel](https://vercel.com/) |

---

## Architecture

### Frontend Structure

TanStack Start with file-based routing (`src/routes/`). Three routes: index (homepage), about, and a custom 404. All Digital Bus components live in `src/components/digital-bus/`.

### Audio Architecture

A single persistent `HTMLAudioElement` managed by the `useAudioPlayer` hook. The audio element is created once and reused across track changes — never destroyed during seeking or track switches. Playback state, progress, and duration are synchronized via native audio events (`timeupdate`, `canplay`, `ended`, `error`).

### Playlist & Shuffle Logic

77 tracks defined in `src/data/playlist.ts` with metadata (title, artist, album, year, audio path, cover path). On each session, a Fisher-Yates shuffle generates a unique play order. Queue index is persisted in `localStorage` so returning visitors continue from where they left off.

### Presence System

Server-side in-memory session map (`src/lib/presence.ts`) using TanStack Start server functions. Clients ping every 10 seconds with a unique persistent client ID. Sessions expire after 25 seconds of inactivity.

### Notification / Toast System

Single-toast policy enforced by `ToastSystem.tsx`. Only one notification can be visible at a time. Supports three toast types: `b_key` (bus horn), `xpert_promo` (Xpert Melody), and `custom_banner`. Auto-dismisses after configurable duration.

### Metadata & Artwork Handling

ID3v2 tags are parsed directly from MP3 files at runtime (`src/lib/id3.ts`). The parser reads the first 256KB of each file to extract title, artist, album, and embedded cover art. Parsed metadata is cached in memory.

### Deployment

Deployed to Vercel via TanStack Start's Nitro integration. Server functions (presence) run as serverless functions. Static assets (songs, images) are served from the `public/` directory.

---

## Music

Songs are stored as MP3 files in `public/Songs/`. Track metadata is defined in `src/data/playlist.ts` and augmented at runtime by parsing embedded ID3 tags. Album artwork is extracted from ID3 APIC frames when available, with a fallback to the bus-stop background image.

---

## SEO

- Canonical URLs (`/` and `/about`)
- `sitemap.xml` and `robots.txt`
- Open Graph metadata (title, description, image, URL)
- Twitter Card metadata
- JSON-LD structured data (`WebSite`, `WebApplication`, `Person`, `MusicPlaylist` with all tracks)
- Semantic HTML (`<main>`, `<header>`, `<footer>`, `<section>`, `<h1>`–`<h3>`, `<nav>`)
- Descriptive meta descriptions
- Keyword-rich but natural page titles

---

## Deployment

The project is deployed on Vercel using TanStack Start with Nitro.

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
digital-bus/
├── public/
│   ├── Songs/                    # MP3 audio files
│   ├── covers/                   # Album cover images
│   ├── bus-stop-bg.jpg           # Main background artwork
│   ├── og-image.png              # Open Graph share image
│   ├── favicon.svg               # Site favicon
│   ├── manifest.json             # PWA manifest
│   ├── robots.txt                # Search engine directives
│   └── sitemap.xml               # Sitemap
├── src/
│   ├── components/
│   │   └── digital-bus/
│   │       ├── DigitalBus.tsx     # Main homepage component
│   │       ├── MusicPlayer.tsx    # Glass music player
│   │       ├── PlayerControls.tsx # Play/Pause/Skip buttons
│   │       ├── ProgressBar.tsx    # Seek bar with pointer capture
│   │       ├── BrandTitle.tsx     # डिजिटल बस title
│   │       ├── JourneyTicker.tsx  # Rotating atmospheric text
│   │       ├── ToastSystem.tsx    # Single-toast notification system
│   │       ├── RainEffect.tsx     # Canvas rain animation
│   │       ├── AtmosphereOverlay.tsx # Day/night gradient overlay
│   │       ├── AudioWaveform.tsx  # Mini spectrum bars
│   │       ├── Clock.tsx          # Live time display
│   │       ├── OnlineStatus.tsx   # Real-time presence counter
│   │       ├── MusicLinks.tsx     # Spotify/YouTube Music links
│   │       └── Footer.tsx         # Footer with credits & links
│   ├── hooks/
│   │   ├── useAudioPlayer.ts     # Core audio engine
│   │   ├── useKeyboardShortcuts.ts # Centralized keyboard handler
│   │   ├── useClock.ts           # Time/date formatting
│   │   └── use-mobile.tsx        # Mobile detection
│   ├── lib/
│   │   ├── audioEffects.ts       # Web Audio API (horn, ambient)
│   │   ├── id3.ts                # ID3v2 metadata parser
│   │   ├── presence.ts           # Server-side presence tracking
│   │   └── utils.ts              # Utilities
│   ├── data/
│   │   └── playlist.ts           # Track definitions & external links
│   ├── routes/
│   │   ├── __root.tsx            # Root layout, 404, error boundary
│   │   ├── index.tsx             # Homepage route
│   │   └── about.tsx             # About page route
│   ├── styles.css                # Global styles & Tailwind config
│   ├── router.tsx                # TanStack Router setup
│   └── start.ts                  # TanStack Start entry
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Credits

Created by **Yash Shinde**.

- Portfolio: [yashshinde.is-a.dev](https://yashshinde.is-a.dev)
- Nyxen: [nyxen.in](https://nyxen.in)
- Xpert Melody: [youtube.com/@XpertMelody](https://www.youtube.com/@XpertMelody)

---

## Support

If you enjoy the Digital Bus experience:

❤️ [Support the journey](https://www.thankyouverymuch.co/yash)

---

## Music & Content Disclaimer

The music files included in this project are used for personal and educational purposes. Digital Bus does not claim ownership or licensing rights over any of the songs in the playlist. All music rights belong to their respective artists, composers, and rights holders. If you are a rights holder and would like content removed, please reach out.

---

**Digital Bus — डिजिटल बस**

_For the long way home._
