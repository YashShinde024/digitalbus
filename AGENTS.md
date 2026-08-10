# Digital Bus — Agent & Developer Development Guide

## Project Purpose
Digital Bus is an atmospheric, web-based digital radio station inspired by Indian bus journeys, lo-fi, indie music, and rainy mountain roads.

## Tech Stack
- **Framework:** React 19 + TanStack Start & TanStack Router
- **State & Data:** TanStack Query v5
- **Styling:** Tailwind CSS v4
- **Build & SSR Engine:** Vite 8 + Nitro (Cloudflare Module preset)
- **Audio Engine:** Native HTML5 `Audio` API (`useAudioPlayer.ts`)

## Critical Architectural Rules for AI Agents

1. **Single Audio Engine Instance:**
   - Always maintain **exactly one** `HTMLAudioElement` instance in `useAudioPlayer.ts`.
   - Do NOT create multiple `<audio>` elements or dual player logic.

2. **Client-Side Playback Independence:**
   - Audio playback MUST remain 100% independent per visitor session.
   - Do NOT synchronize music playback or current track across users via WebSockets or backend state.

3. **Session Fisher-Yates Shuffle:**
   - Every visitor receives a session-unique randomized queue.
   - Do NOT add a playlist track selector UI unless explicitly requested by the user.

4. **On-Demand Range Request ID3 Metadata:**
   - Metadata is parsed on-demand via 256KB range requests (`id3.ts`).
   - Do NOT load full 10MB audio files into memory at once.

5. **Visual Hierarchy & Layering:**
   - Background image (`z-0`) → Monsoon Rain (`RainEffect.tsx`, `z-[1]`) → Scene Veil (`z-[2]`) → Interactive UI (`z-10`).
   - Monsoon rain MUST always sit BEHIND interactive UI components.

6. **Devanagari Brand Title:**
   - Brand title MUST remain stacked Devanagari (`डिजिटल` / `बस`) centered on the page.

## Commands
- `npm run dev` — Start Vite local dev server (`http://localhost:3000`)
- `npm run build` — Production build (Vite + Nitro)
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint check
