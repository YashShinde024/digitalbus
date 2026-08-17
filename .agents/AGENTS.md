# Digital Bus — Development Conventions

## Tech Stack

- **Framework:** TanStack Start (React meta-framework with SSR/SSG support via Nitro)
- **UI:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 (with `@tailwindcss/vite` plugin, `@import "tailwindcss" source(none)` pattern)
- **Bundler:** Vite 8
- **Routing:** TanStack Router (file-based, `src/routes/`)
- **Server:** Nitro (serverless functions for presence tracking)
- **Deployment:** Vercel

## Component Architecture

All Digital Bus components live in `src/components/digital-bus/`. The `DigitalBus.tsx` component is the main homepage orchestrator that assembles all sub-components (player, brand title, clock, footer, toast, etc.).

**Do not** create components outside of `src/components/digital-bus/` for the main experience.

## Audio Architecture

The audio system uses a **single persistent hidden YouTube IFrame Player instance** managed by `src/hooks/useAudioPlayer.ts`. Key rules:

- Never create multiple YouTube Player instances
- Never destroy/recreate the player during seeking, track changes, or progress polling
- The audio player state is exposed globally via a stable `window.digitalBusAudio` shim using property getters/setters for keyboard shortcuts
- Active playback metadata is strictly committed upon receiving the `YT.PlayerState.PLAYING` event and verifying `getVideoData().video_id` against the active request token
- `playbackRequestIdRef` and `currentRequestRef` track monotonic request tokens to prevent race conditions during rapid track skipping
- `isDraggingRef` prevents progress polling from overwriting the user's seek position during slider drag
- Shuffle generates a single stable queue cycle using Fisher-Yates and advances a pointer without reshuffling on every track transition
- History stack records backward navigation explicitly with `{ recordHistory: false }` to avoid navigation corruptions

## Toast / Notification System

`ToastSystem.tsx` enforces a **single-toast-at-a-time** policy. Toast triggers are exposed on `window`:

- `window.digitalBusTriggerToast(type, message)` — show a toast
- `window.digitalBusToggleToast(type, message)` — toggle a toast
- `window.triggerToastBanner(message)` — legacy helper for Easter eggs

Toast types: `b_key`, `xpert_promo`, `custom_banner`.

## Keyboard Shortcuts

All keyboard shortcuts are centralized in `src/hooks/useKeyboardShortcuts.ts`. **Do not** add separate `keydown` listeners in individual components. The hook handles input/textarea/contentEditable guards and `e.repeat` suppression.

## Styling Conventions

- Use Tailwind utility classes for layout and typography
- Custom utilities are defined in `src/styles.css` using `@utility` syntax (Tailwind v4)
- Key custom utilities: `glass-panel`, `scene-veil`, `grain-overlay`, `player-halo`, `brand-mark`, `text-glow`, `hide-scrollbar`
- Custom CSS properties: `--cream`, `--ink`, `--online`
- Fonts: Manrope (sans), Yatra One (display/Devanagari)

## Presence System

`src/lib/presence.ts` uses TanStack Start server functions (`createServerFn`) with an in-memory `Map` for session tracking. Sessions time out after 25 seconds. Clients ping every 10 seconds.

## External Links

All external URLs (Spotify, YouTube Music, Xpert Melody, support) are defined in `src/data/playlist.ts` under `externalLinks`. **Do not** hardcode external URLs elsewhere.

## SEO

- Structured data (JSON-LD) is defined in `__root.tsx` (homepage) and `about.tsx` (about page)
- Each route defines its own `head()` with page-specific title, meta description, and OG tags
- Canonical URLs, sitemap, and robots.txt are configured

## Visual Identity

Digital Bus has a calm, nostalgic, cinematic identity. **Do not** introduce flashy animations, bright colors, or marketing-style UI elements. The aesthetic is: warm tones, glassmorphism, subtle rain, Indian typography (Yatra One), and muted cream-on-dark color palette.
