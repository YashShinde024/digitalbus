# Digital Bus

> An immersive web-based listening experience built around nostalgic Hindi and Bollywood music.

🌐 **Live:** [digitalbus.me](https://digitalbus.me)

---

## About

Digital Bus is a browser-based music experience designed around the feeling of travelling somewhere — rain outside the window, familiar songs in your headphones, and a road that seems a little longer at night.

Instead of being another music player with a playlist, Digital Bus turns listening into a small visual journey — combining a cinematic Indian bus-stop environment, atmospheric monsoon rain, and a glassmorphic music player into a single cohesive experience.

---

## Features

- 🚌 Authentic Maharashtra ST (_महाराष्ट्र राज्य मार्ग परिवहन महामंडळ_) scenic background crossfade (Khandala, Bhor, Koyna Lake, Satara)
- 🎵 Nostalgic Hindi & Bollywood music library
- 🎶 77-track curated collection with high-resolution album artwork
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

| Key       | Action                                             |
| --------- | -------------------------------------------------- |
| `Space`   | Play / Pause current song                          |
| `N` / `P` | Next / Previous track                              |
| `Q`       | Open / Close Playlist Queue                        |
| `T`       | Open / Close Share Ticket Modal                    |
| `S`       | Toggle Shuffle mode                                |
| `M`       | Mute / Unmute music                                |
| `←` / `→` | Seek backward / forward 5 seconds                  |
| `B`       | "अरे! बस रोक क्यों दी? 🚌" (Easter egg horn toast) |

Shortcuts are disabled when typing in input fields. Space does not scroll the page when used as a player shortcut.

---

## Tech Stack

| Layer      | Technology                                                                   |
| ---------- | ---------------------------------------------------------------------------- |
| Framework  | [TanStack Start](https://tanstack.com/start) (React meta-framework with SSR) |
| UI Library | [React 19](https://react.dev)                                                |
| Language   | [TypeScript](https://www.typescriptlang.org/)                                |
| Bundler    | [Vite 8](https://vite.dev/)                                                  |
| Styling    | [Tailwind CSS v4](https://tailwindcss.com/)                                  |
| Audio      | YouTube IFrame Player API + Web Audio API (ambient engine)                   |
| Server     | [Nitro](https://nitro.build/) (serverless functions for presence)            |
| Icons      | [Lucide React](https://lucide.dev/)                                          |
| Routing    | [TanStack Router](https://tanstack.com/router) (file-based)                  |
| Deployment | [Vercel](https://vercel.com/)                                                |

---

## Architecture

### Frontend Structure

TanStack Start with file-based routing (`src/routes/`). Three routes: index (homepage), about, and a custom 404. All Digital Bus components live in `src/components/digital-bus/`.

### Media & Streaming Architecture

Media playback is streamed externally using the **YouTube IFrame Player API** via a single persistent hidden player controlled by `useAudioPlayer.ts`. This architecture provides zero local bandwidth overhead while maintaining a custom, premium glassmorphic UI.

Key architectural invariants:
- **Authoritative Playback Synchronization:** Active track index and UI metadata are only committed upon receiving the YouTube `PLAYING` state change matching the requested video token and verified `getVideoData().video_id`.
- **Request Generation Tokens:** Rapid track clicks increment a monotonic request ID (`playbackRequestIdRef`) and record pending selections without permitting stale buffering events from older requests to overwrite active metadata.
- **Error Protection & Timers:** Video error codes (2, 5, 100, 101, 150) are tracked per video ID to prevent loops. Stale auto-skip timers are cancelled upon every new user request and on unmount.
- **Stable Global Audio Shim:** `window.digitalBusAudio` is registered once and reads active player state via references, ensuring compatibility with centralized keyboard shortcuts without recreating objects during polling.

### Playlist & Shuffle Logic

77 tracks defined in `src/data/playlist.ts` with metadata (title, artist, album, year, cover path, and verified unique `youtubeId`). A Fisher-Yates shuffle creates a stable queue cycle upon enabling shuffle or exhausting the queue, rather than regenerating on every track switch. Queue index is persisted in `localStorage`.

### Presence System

Lightweight client presence pinging (`src/lib/presence.ts`) tracking active bus passengers.

### Notification / Toast System

Single-toast policy enforced by `ToastSystem.tsx`. Only one notification can be visible at a time. Supports three toast types: `b_key` (bus horn), `xpert_promo` (Xpert Melody), and `custom_banner`. Auto-dismisses after configurable duration.

### Deployment

Deployed to Vercel via TanStack Start's Nitro integration. Static artwork (`public/covers/`, `public/backgrounds/`) is served efficiently with edge caching.

---

## Music

77 nostalgic Hindi and Bollywood tracks from the golden era are curated in `src/data/playlist.ts`. Media streams directly from YouTube via embeddable video IDs, with high-resolution artwork displayed locally.

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
│   ├── covers/                   # 77 album artwork images
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
│   │   ├── useAudioPlayer.ts     # Core YouTube streaming & state synchronization engine
│   │   ├── useKeyboardShortcuts.ts # Centralized keyboard shortcut handler
│   │   └── useClock.ts           # Time & date ticker hook
│   ├── lib/
│   │   ├── audioEffects.ts       # Web Audio API ambient synthesizer
│   │   ├── playlistValidator.ts  # Development & build-time playlist validator
│   │   └── presence.ts           # Passenger presence tracking
│   ├── data/
│   │   └── playlist.ts           # 77 curated tracks with verified YouTube IDs
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

The media accessed in this project is streamed directly via the YouTube IFrame API from YouTube for personal and educational purposes. Digital Bus does not host, re-encode, or redistribute raw audio files. All music rights belong to their respective artists, composers, and rights holders.

---

**Digital Bus — डिजिटल बस**

_For the long way home._
