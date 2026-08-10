# Digital Bus — डिजिटल बस

[![Live Demo](https://img.shields.io/badge/Website-digitalbus.me-10b981?style=for-the-badge&logo=cloudflare)](https://digitalbus.me)
[![React 19](https://img.shields.io/badge/React-19.2.0-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![TanStack Start](https://img.shields.io/badge/Framework-TanStack_Start-ff4154?style=for-the-badge&logo=tanstack)](https://tanstack.com)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind_v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/Code_License-MIT-blue?style=for-the-badge)](./LICENSE)

A cozy, atmospheric, web-based music experience inspired by Indian bus journeys, mountain rain, nature, nostalgia, lo-fi, and indie music. Built with **React 19**, **TanStack Start & Router**, **Tailwind CSS v4**, and native **HTML5 Audio API**.

- **Live Website:** [https://digitalbus.me](https://digitalbus.me)
- **Created by:** [Yash Shinde](https://yashshinde.is-a.dev)
- **Support Project:** [thankyouverymuch.co/yash](https://www.thankyouverymuch.co/yash)
- **Branding Partner:** [nyxen.in](https://nyxen.in)

---

## 1. Project Overview

**Digital Bus** is an immersive digital radio station designed to capture the cozy, nostalgic mood of traveling through misty mountain roads on a rainy Indian bus. 

Unlike traditional music streaming platforms with overwhelming playlists, search bars, and algorithmic queues, Digital Bus offers a passive, curated listening journey:
- **No Playlist Selection:** Visitors step onto the bus and enjoy a continuous stream of lo-fi, indie, and nostalgic Indian tracks.
- **Client-Side Journey:** Every visitor receives their own unique, randomized listening sequence per browser session.
- **Cozy Atmospheric Layering:** Features a vintage bus stop background paired with a high-performance 60fps monsoon rain effect and an Apple iOS-inspired glassmorphism music player.

---

## 2. Features

- 🚌 **Vintage Bus Artwork & Atmospheric Scene:** Native high-resolution environmental background with a vintage Indian bus parked by a mountain river.
- 🌧️ **Cinematic Monsoon Rain Effect (`RainEffect.tsx`):** Lightweight 60fps HTML5 Canvas rain layer that respects `prefers-reduced-motion` and automatically pauses when switching browser tabs.
- 🪔 **Hero Devanagari Wordmark (`BrandTitle.tsx`):** Large stacked `डिजिटल` / `बस` brand mark rendered in `Yatra One` typography.
- 🔀 **Session Fisher-Yates Shuffle:** Generates a randomized track queue locally per visitor session without repeating songs.
- 📻 **Single HTML5 Audio Engine (`useAudioPlayer.ts`):** High-performance playback using a single `HTMLAudioElement` instance to prevent duplicate audio streams.
- 🔁 **Automatic Track Progression:** Audio `ended` event automatically advances and plays the next track in the user's shuffle queue.
- 🏷️ **On-Demand ID3 Metadata & Artwork Extraction (`id3.ts`):** Parses MP3 ID3v2 tags and embedded album covers (APIC frames) on-demand using 256KB range requests without downloading entire audio files.
- 🎛️ **Two Distinct Player Visuals:**
  - **Small Spectrum (`AudioWaveform.tsx`):** Compact 16-bar decorative audio activity indicator placed directly under track metadata.
  - **Straight Progress Line (`ProgressBar.tsx`):** Minimalist horizontal seek line with subtle position thumb and interactive click/drag seeking.
- 🟢 **Real-Time Presence Counter (`OnlineStatus.tsx`):** Lightweight server-function presence engine (`src/lib/presence.ts`) displaying live active visitors anonymously (`● X online`).
- 📱 **Fully Responsive Layout:** Optimized across 320px, 375px, 414px, 768px, 1024px, and 1440px+ viewports.
- 🌐 **Comprehensive SEO + AEO + GEO:** Full OpenGraph image support, JSON-LD structured data (`WebSite`, `WebApplication`, `Person`), canonical URLs, `sitemap.xml`, `robots.txt`, and `manifest.json`.

---

## 3. How the Music System Works

The audio system is engineered to be **100% client-side and serverless for playback**. Every user visiting Digital Bus listens to music independently without WebSocket overhead or global playback synchronization.

### Audio Architecture Diagram

```
User Action (Play / Seek / Auto-Next)
                  │
                  ▼
         MusicPlayer Component
                  │
                  ▼
       useAudioPlayer Hook (State Engine)
        ├── Fisher-Yates Session Shuffle
        ├── On-Demand ID3 Metadata Parser (id3.ts)
        └── Event Listeners (play, pause, ended, timeupdate, error)
                  │
                  ▼
       HTMLAudioElement (Single Instance)
                  │
                  ▼
   Static Audio Files (`/public/Songs/*.mp3`)
```

### Key Technical Behaviors

1. **On-Demand Metadata Loading:** `preload="metadata"` is enforced. When a track loads, `extractID3Metadata()` fetches only the first 256KB (`bytes=0-262144`) of the MP3 file using HTTP Range Requests to parse ID3v2 tags and APIC picture frames.
2. **Fisher-Yates Session Shuffle:** When a user opens Digital Bus, a session shuffle order array is created:
   ```ts
   function shuffleArray(size: number): number[] {
     const array = Array.from({ length: size }, (_, i) => i);
     for (let i = array.length - 1; i > 0; i--) {
       const j = Math.floor(Math.random() * (i + 1));
       [array[i], array[j]] = [array[j]!, array[i]!];
     }
     return array;
   }
   ```
3. **Auto-Next Track Continuity:** Native `audio.addEventListener("ended", ...)` triggers `autoPlayNextRef.current = true` and updates `queueIndex`, automatically loading and starting the next track in the shuffled sequence.
4. **Error Skipping:** If an audio file fails to load or returns a 404/network error, the player attempts 3 auto-skips to the next valid track before showing a manual retry button.

---

## 4. Multi-User / Online Presence System

While music playback is **completely local to each visitor's browser**, Digital Bus displays a live count of active visitors using a lightweight presence engine powered by TanStack Start server functions (`src/lib/presence.ts`).

### Presence Mechanics
- **Anonymous Session ID:** Every browser session generates a random string (`crypto.randomUUID()`).
- **Heartbeat:** `OnlineStatus.tsx` sends a lightweight HTTP ping (`pingPresence(sessionId)`) every 10 seconds.
- **Server Store & Pruning:** Active sessions are kept in an in-memory Map. Sessions without a heartbeat for over 30 seconds are pruned automatically.
- **Privacy & Security:** Zero personal data, IP addresses, usernames, or cookies are stored or collected.

---

## 5. Tech Stack

| Technology | Purpose |
|---|---|
| **React 19.2** | UI Component Architecture & State |
| **TanStack Start & Router** | Full-Stack Meta-Framework & Type-Safe Routing |
| **TanStack Query v5** | Client Data Fetching & Query Management |
| **Tailwind CSS v4** | Design System, Utility Classes & Glassmorphism |
| **Nitro & Cloudflare Module** | SSR Engine & Serverless Deployment |
| **Lucide React** | Minimalist UI Icons |
| **TypeScript 5.8** | Type Safety & Developer Experience |

---

## 6. Project Structure

```
digital-bus/
├── public/
│   ├── Songs/             # 70+ MP3 audio files
│   ├── bus-stop-bg.jpg    # Main background artwork
│   ├── og-image.png       # OpenGraph social preview image
│   ├── favicon.svg        # Custom bus vector icon
│   ├── manifest.json      # Web Application Manifest
│   ├── robots.txt         # Search engine crawler instructions
│   └── sitemap.xml        # XML Sitemap referencing https://digitalbus.me
├── src/
│   ├── components/
│   │   └── digital-bus/
│   │       ├── AudioWaveform.tsx     # Small 16-bar decorative spectrum
│   │       ├── BrandTitle.tsx        # Large stacked Devanagari hero title (डिजिटल / बस)
│   │       ├── Clock.tsx             # Live date and time indicator
│   │       ├── DigitalBus.tsx        # Main container & background layout
│   │       ├── Footer.tsx            # Footer with creator & support links
│   │       ├── MusicLinks.tsx        # Spotify & YouTube Music links
│   │       ├── MusicPlayer.tsx       # Apple glassmorphism player panel
│   │       ├── OnlineStatus.tsx      # Real-time online visitor counter
│   │       ├── PlayerControls.tsx    # Play/Pause, Next, Previous buttons
│   │       ├── ProgressBar.tsx       # Primary straight horizontal seek bar
│   │       └── RainEffect.tsx        # 60fps HTML5 Canvas monsoon rain layer
│   ├── data/
│   │   └── playlist.ts               # Playlist catalog & external links
│   ├── hooks/
│   │   └── useAudioPlayer.ts         # Single audio engine & shuffle state hook
│   ├── lib/
│   │   ├── id3.ts                    # ID3v2 tag & cover art range-request parser
│   │   └── presence.ts               # Presence server function (`pingPresence`)
│   ├── routes/
│   │   ├── __root.tsx                # Meta, SEO, JSON-LD & root shell
│   │   └── index.tsx                 # Home route entry point
│   ├── server.ts                     # TanStack Start server handler
│   ├── start.ts                      # Client entry point
│   └── styles.css                    # Design tokens & glassmorphism utilities
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 7. Core Components

- **`DigitalBus.tsx`:** Manages page layout hierarchy (`Background Image` → `Rain Layer (z-[1])` → `Scene Veil (z-[2])` → `Interactive UI (z-10)`).
- **`BrandTitle.tsx`:** Renders the stacked hero Devanagari title (`डिजिटल` / `बस`) using `Yatra One` font and soft drop shadow.
- **`MusicPlayer.tsx`:** Apple-inspired glass container featuring backdrop blur (`blur-2xl`), subtle white border, and soft halo lighting.
- **`ProgressBar.tsx`:** Interactive straight progress line supporting click-to-seek, drag-to-seek, and formatted timestamps (`0:42 / 4:18`).
- **`AudioWaveform.tsx`:** Compact 16-bar animated spectrum indicator under track info.
- **`RainEffect.tsx`:** 60fps HTML5 Canvas rain generator with slanted monsoon raindrops and atmospheric mist.
- **`OnlineStatus.tsx`:** Displays live visitor count (`● X online`) with glowing pulse dot.

---

## 8. Adding Music

To add new songs to Digital Bus:

1. **Add MP3 File:** Place the audio file in `public/Songs/` (e.g., `public/Songs/YourSong.mp3`).
2. **(Optional) Embed ID3 Tags:** For best results, embed ID3v2 tags (Title, Artist, and Cover Artwork) into the MP3 file using an audio editor like TagScanner or Mp3tag.
3. **Register in `src/data/playlist.ts`:**
   ```ts
   {
     id: 75,
     title: "Song Name",
     artist: "Artist Name",
     audio: "/Songs/YourSong.mp3",
     cover: "/bus-stop-bg.jpg" // Fallback cover if ID3 artwork is absent
   }
   ```
4. **Test:** Run `npm run dev` and click **Next** to verify playback, artwork extraction, and timestamps.

---

## 9. Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yashshinde/digital-bus.git
cd digital-bus

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

The application will be running at `http://localhost:3000`.

### Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles production client, SSR, and Nitro server bundles.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run format`: Formats code using Prettier.

---

## 10. Environment Variables

Digital Bus runs out of the box without requiring mandatory third-party API keys or environment variables. 

Optional environment configuration for Cloudflare Workers / Nitro deployment:

```env
# Optional port configuration for local previews
PORT=3000
```

---

## 11. Deployment

Digital Bus is built using **TanStack Start** with **Nitro** configured for the `cloudflare-module` preset.

### Deploying to Cloudflare Workers

```bash
# 1. Build the production bundle
npm run build

# 2. Deploy using Nitro / Wrangler
npx wrangler deploy
```

The build output is generated in `.output/server/` and `.output/public/`.

---

## 12. SEO / AEO / GEO Implementation

Digital Bus is optimized for search engines, AI answer engines, and social media previews:

- **Canonical URL:** `https://digitalbus.me/`
- **Title Tag:** `Digital Bus — Lo-Fi, Indie & Indian Music for the Journey`
- **OpenGraph:** `og:image` pointing to `https://digitalbus.me/og-image.png`.
- **JSON-LD Structured Data (`__root.tsx`):**
  ```json
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://digitalbus.me/#website",
        "url": "https://digitalbus.me/",
        "name": "Digital Bus",
        "alternateName": "डिजिटल बस",
        "publisher": { "@id": "https://digitalbus.me/#person" }
      },
      {
        "@type": "WebApplication",
        "@id": "https://digitalbus.me/#webapp",
        "name": "Digital Bus Radio",
        "applicationCategory": "MultimediaApplication"
      },
      {
        "@type": "Person",
        "@id": "https://digitalbus.me/#person",
        "name": "Yash Shinde",
        "url": "https://yashshinde.is-a.dev"
      }
    ]
  }
  ```
- **Sitemap & Robots:** `public/sitemap.xml` and `public/robots.txt`.

---

## 13. Performance Optimizations

- **Range Request ID3 Extraction:** Reads only 256KB of MP3 headers for ID3 tag parsing instead of fetching full 10MB audio files.
- **No Unnecessary Preloading:** Uses `preload="metadata"` and single `HTMLAudioElement` instance.
- **Canvas Rain Animation:** Uses `requestAnimationFrame` with tab visibility detection (`visibilitychange`) to pause rain rendering when hidden.
- **Session State:** Shuffle order array is computed once per session in React memory.

---

## 14. Accessibility (a11y)

- **Keyboard Navigation:** Progress slider supports `ArrowLeft` and `ArrowRight` keyboard seeking.
- **ARIA Labels:** Explicit `aria-label` attributes on player controls, seek slider, and external links.
- **Prefers Reduced Motion:** Rain animation and wave pulses automatically pause when `prefers-reduced-motion: reduce` is enabled.
- **Focus Rings:** Visible focus outlines (`focus-visible:ring-1`) for all interactive buttons and links.

---

## 15. Privacy

- **No Cookies:** Digital Bus uses zero cookies.
- **No User Tracking:** No personal data, IP addresses, or location data are logged or collected.
- **Independent Playback:** Audio playback state exists exclusively in each visitor's browser.
- **Anonymous Presence:** Presence heartbeats use randomly generated UUID session tokens stored temporarily in memory.

---

## 16. Security

- **Safe External Links:** All external links (`Yash`, `Support`, `Nyxen`, `Spotify`, `YouTube Music`) use `target="_blank" rel="noopener noreferrer"`.
- **Strict Content Headers:** Static headers generated via Nitro `.output/public/_headers`.

---

## 17. Troubleshooting

### Audio fails to play automatically
Browsers enforce strict autoplay policies. If audio fails to start on initial load, click the **Play** button once to grant browser audio context permission.

### Cover art shows fallback icon
If an MP3 file lacks an embedded APIC picture frame, Digital Bus gracefully displays the fallback artwork (`/bus-stop-bg.jpg`).

---

## 18. License & Music Copyright

- **Source Code License:** The source code of Digital Bus is licensed under the [MIT License](./LICENSE).
- **Audio Assets Notice:** Audio files contained within `public/Songs/` belong to their respective original artists and copyright owners. Audio assets are included strictly for demonstration and non-commercial streaming purposes and are **NOT** covered under the MIT open-source code license.

---

## 19. Credits & Support

Crafted with ❤️ for the journey by **Yash Shinde**.

- **Portfolio:** [yashshinde.is-a.dev](https://yashshinde.is-a.dev)
- **Live Radio:** [digitalbus.me](https://digitalbus.me)
- **Branding:** [nyxen.in](https://nyxen.in)
- **Support the Journey:** [thankyouverymuch.co/yash](https://www.thankyouverymuch.co/yash)
