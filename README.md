# 🚌 Digital Bus

> A cozy digital journey through music, memories, and the road ahead.

**Digital Bus** is a browser-based ambient music experience inspired by long bus rides, Indian landscapes, nostalgic music, and quiet moments on the road.

Instead of being another conventional music player, Digital Bus turns listening into a small visual journey — combining a cinematic Indian-inspired environment with an interactive music player.

🌐 **Live:** https://digitalbus.me

---

## ✨ Experience

Digital Bus is designed around a simple idea:

> Sometimes you don't need a destination. You just need a good song and a window seat.

The interface combines:

- 🌄 Cinematic Indian-inspired landscapes
- 🚌 Cozy bus journey atmosphere
- 🎵 Curated music playback
- 🌧️ Ambient rain effects
- 🕒 Real-time date & time
- 🟢 Live online listener count
- 🎧 Spotify & YouTube Music shortcuts
- 🎚️ Interactive audio visualization
- 🪟 Apple-inspired glassmorphism
- 📱 Responsive mobile experience
- 🚌 Small interactive Easter eggs

Every visitor gets their own independent listening experience.

---

## 🎵 Music Experience

Digital Bus uses a locally hosted music library rather than depending on an external streaming API for the core playback experience.

The player supports:

- Automatic playback progression
- Unique shuffled playback per visitor
- Play / Pause
- Previous / Next
- Seeking
- Current playback time
- Track duration
- Album artwork
- Artist information
- Mini audio spectrum
- Loading states
- Failed-track handling
- Persistent playback preferences

When a track ends, the next track is automatically selected.

Users don't need to manually choose a song every time they visit.

---

## 🎨 Visual Design

The visual direction is inspired by:

- Indian road journeys
- Old buses
- Mountain roads
- Rainy evenings
- Lofi aesthetics
- Nostalgic Indian cinema
- Cozy travel photography
- Modern glassmorphism

The interface intentionally avoids looking like a conventional Spotify clone.

The goal is to make the website feel like a **digital window seat**.

---

## 🖥️ Interface

The experience includes:

### Digital Bus Header

The main Hindi typography:

**डिजिटल बस**

with the English subtitle:

**DIGITAL BUS**

The header also contains:

- Current time
- Current date
- Online listener count
- Spotify shortcut
- YouTube Music shortcut

### Music Player

The central player contains:

- Album artwork
- Song title
- Artist
- Mini spectrum visualization
- Play / Pause
- Previous / Next
- Progress indicator
- Current time
- Total duration

The player uses a translucent glass interface so the environment remains visible behind it.

### Footer

The footer contains:

**Crafted for the long way home · Yash ❤️**

along with:

- Support the journey
- Nyxen

---

## 🚌 Easter Eggs

Digital Bus contains a few small interactions hidden throughout the experience.

For example:

### Bus Horn

Press:

```text
B
```

to trigger the bus horn.

The interaction is intentionally subtle and does not interrupt music playback.

---

## 🌧️ Ambient Experience

The website can enhance the journey with subtle environmental effects such as:

- Rain
- Background atmosphere
- Time-based lighting
- Gentle motion
- Audio-reactive visualization

Effects are designed to remain lightweight and never overpower the music.

The experience also respects:

```text
prefers-reduced-motion
```

where applicable.

---

## 📱 Responsive Design

Digital Bus is designed to work across:

- Desktop
- Laptop
- Tablet
- Mobile
- Mobile landscape

The interface adapts the player, typography, navigation, footer, and interactive elements for smaller screens.

---

## 🛠️ Tech Stack

Digital Bus is built with modern web technologies.

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

### Audio

- HTML5 Audio
- Web Audio API
- Audio-reactive visualization

### UI

- Responsive CSS
- Glassmorphism
- CSS animations
- Browser APIs

### Deployment

The project is designed to be deployable as a modern static frontend.

---

## 📁 Project Structure

```text
digital-bus/
│
├── public/
│   ├── Songs/
│   │   └── *.mp3
│   ├── bus-stop-bg.jpg
│   ├── favicon/
│   └── og-image.png
│
├── src/
│   ├── components/
│   │   ├── digital-bus/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   ├── data/
│   └── routes/
│
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── ...
```

> The exact structure may evolve as the project grows.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YashShinde024/digitalbus.git
cd digital-bus
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at the local development URL shown by Vite.

### 4. Create a production build

```bash
npm run build
```

### 5. Preview the production build

```bash
npm run preview
```

---

## 🎶 Adding Music

Songs are stored locally inside the project's public audio directory.

Track metadata and artwork are handled by the application's music system.

When adding new tracks, make sure:

- The audio file is supported by modern browsers.
- File names are safe and predictable.
- Album artwork is embedded or supplied correctly.
- Track metadata is correctly mapped.
- Large unnecessary files are avoided.

---

## 🔀 Per-Visitor Playback

Digital Bus does not use one global player state for everyone.

Each visitor has their own:

- Current track
- Playback position
- Shuffle order
- Player state
- Preferences

This means two people can visit Digital Bus simultaneously and listen to completely different songs.

---

## 🟢 Online Counter

The online counter represents active visitors currently using Digital Bus.

The system is designed so that individual users do not control the displayed count manually.

The implementation can be evolved independently from the music player.

---

## 🔍 SEO & Discoverability

Digital Bus includes a dedicated SEO layer covering:

- Page title
- Meta description
- Canonical URL
- Open Graph metadata
- Social sharing metadata
- Structured metadata where appropriate
- Robots configuration
- Sitemap
- Semantic HTML
- Search-friendly content

Primary website:

**[https://digitalbus.me](https://digitalbus.me)**

The project is designed around the concept of a digital music journey rather than a generic music player.

---

## 🌐 External Links

Digital Bus connects users to:

- Spotify
- YouTube Music
- Yash's portfolio
- Nyxen
- Support page

External links should always open safely and remain independent from the core listening experience.

---

## ❤️ Support

If you enjoy the Digital Bus experience and want to support its development:

**Support the journey**

Support page:

[https://www.thankyouverymuch.co/yash](https://www.thankyouverymuch.co/yash)

Every bit of support helps keep the project moving.

---

## 👨‍💻 Created By

**Yash Shinde**

Full Stack Developer & Founder at Nyxen.

Portfolio:

[https://yashshinde.is-a.dev](https://yashshinde.is-a.dev)

Nyxen:

[https://nyxen.in](https://nyxen.in)

---

## 🏢 Built Under Nyxen

Digital Bus is an independent project created under **Nyxen**.

**Innovate. Build. Empower.**

[https://nyxen.in](https://nyxen.in)

---

## 📜 License

MIT License — see [LICENSE](./LICENSE) for details.

---

## 🛣️ Roadmap

Possible future improvements:

- [ ] More journey environments
- [ ] More atmospheric effects
- [ ] Additional ambient sounds
- [ ] More interactive Easter eggs
- [ ] Expanded audio visualization
- [ ] Improved accessibility
- [ ] More personalized journey experiences
- [ ] Additional performance optimizations
- [ ] More curated music collections

The roadmap may change as Digital Bus evolves.

---

## ⭐ Why Digital Bus?

There are thousands of music players on the internet.

Digital Bus isn't trying to be another one.

It's a small place to:

**put on your headphones,**

**look out the window,**

**and let the road go by.**

🚌🌧️🎧

---

**Digital Bus — डिजिटल बस**

*For the long way home.*
