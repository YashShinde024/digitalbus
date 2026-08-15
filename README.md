# Digital Bus

> An immersive web-based listening experience built around nostalgic Hindi and Bollywood music.

🌐 **Live:** [digitalbus.me](https://digitalbus.me)

---

## About

Digital Bus is a browser-based music experience designed around the feeling of travelling somewhere — rain outside the window, familiar songs in your headphones, and a road that seems a little longer at night.

Instead of being another music player with a playlist, Digital Bus turns listening into a small visual journey — combining a cinematic Indian bus-stop environment, atmospheric monsoon rain, and a glassmorphic music player into a single cohesive experience.

---

## Features

- 🚌 Authentic Maharashtra ST (*महाराष्ट्र राज्य मार्ग परिवहन महामंडळ*) scenic background crossfade (Khandala, Bhor, Koyna Lake, Satara)
- 🎵 Nostalgic Hindi & Bollywood music library
- 🎶 77-track curated collection with embedded high-resolution artwork
- 🔀 Shuffled unique queue with automatic next-track transitions
- 🪟 Premium glassmorphic music player with frosted glass styling
- 📱 Responsive mobile experience: floating mini player capsule, direct queue access, and swipeable expanded player sheet
- 🎟️ Interactive glassmorphic Bus Ticket sharing modal with compact mobile trigger
- 🟢 Real-time online passenger presence tracking
- ⌨️ Centralized keyboard shortcuts (`Space`, `N`, `P`, `Q`, `T`, `S`, `M`, `←`, `→`, `B`)
- 📻 Ambient bus road sound synthesizer toggle
- 🌄 Time-of-day adaptive lighting atmosphere
- 📖 Dedicated About page with fixed static scenic backgrounds and rich creator / studio story
- 🚫 Zero telemetry, tracking, or account friction

---

## Keyboard Controls

| Key | Action |
|-----|--------|
| `Space` | Play / Pause current song |
| `N` / `P` | Next / Previous track |
| `Q` | Open / Close Playlist Queue |
| `T` | Open / Close Share Ticket Modal |
| `S` | Toggle Shuffle mode |
| `M` | Mute / Unmute music |
| `←` / `→` | Seek backward / forward 5 seconds |
| `B` | "अरे! बस रोक क्यों दी? 🚌" (Easter egg horn toast) |

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
| Audio | HTML5 Audio API + Web Audio API (ambient engine) |
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
│   ├── Songs/                    # 77 MP3 audio files
│   ├── covers/                   # 77 extracted real album artwork images
│   ├── backgrounds/              # 4 Maharashtra ST scenic background artworks
│   ├── og-image.png              # Open Graph share image
│   ├── favicon.svg               # Site favicon
│   ├── manifest.json             # PWA manifest
│   ├── robots.txt                # Search engine directives
│   └── sitemap.xml               # Sitemap
├── src/
│   ├── components/
│   │   └── digital-bus/
│   │       ├── DigitalBus.tsx     # Main homepage orchestrator
│   │       ├── BackgroundScene.tsx # 4-scene rotating crossfade background
│   │       ├── MusicPlayer.tsx    # Glassmorphic desktop & mobile music player
│   │       ├── PlaylistPanel.tsx  # Track queue drawer (desktop popover & mobile sheet)
│   │       ├── ShareTicket.tsx    # Interactive digital bus ticket sharing modal
│   │       ├── PlayerControls.tsx # Play/Pause/Skip/Shuffle/Queue buttons
│   │       ├── ProgressBar.tsx    # Responsive seek bar with pointer capture
│   │       ├── BrandTitle.tsx     # Devanagari brand title (डिजिटल बस)
│   │       ├── JourneyTicker.tsx  # Rotating atmospheric ticker quotes
│   │       ├── ToastSystem.tsx    # Single-toast notification manager
│   │       ├── AtmosphereOverlay.tsx # Adaptive day/night lighting atmosphere
│   │       ├── AudioWaveform.tsx  # Dynamic mini audio visualizer bars
│   │       ├── Clock.tsx          # Live time & date display
│   │       ├── OnlineStatus.tsx   # Real-time passenger presence counter
│   │       ├── MusicLinks.tsx     # Spotify, YouTube Music, Apple Music streaming links
│   │       └── Footer.tsx         # Attributions & external links
│   ├── hooks/
│   │   ├── useAudioPlayer.ts     # Core persistent audio engine
│   │   ├── useKeyboardShortcuts.ts # Centralized keyboard shortcut handler
│   │   └── useClock.ts           # Time & date ticker hook
│   ├── lib/
│   │   ├── audioEffects.ts       # Web Audio API ambient synthesizer
│   │   ├── id3.ts                # ID3v2 metadata & artwork parser
│   │   └── presence.ts           # Serverless passenger presence tracking
│   ├── data/
│   │   └── playlist.ts           # 77 curated tracks & streaming URLs
│   ├── routes/
│   │   ├── __root.tsx            # Root layout, head metadata, 404
│   │   ├── index.tsx             # Homepage route
│   │   └── about.tsx             # Dedicated about route
│   ├── styles.css                # Tailwind CSS v4 & custom glassmorphism utilities
│   ├── router.tsx                # TanStack Router configuration
│   └── start.ts                  # TanStack Start entry point
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
