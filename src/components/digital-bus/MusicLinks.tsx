import { externalLinks } from "@/data/playlist";

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.586 14.424a.622.622 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 1 1-.277-1.215c3.809-.871 7.077-.496 9.712 1.115a.623.623 0 0 1 .207.857Zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.688-1.652-6.786-2.131-9.965-1.166a.78.78 0 1 1-.452-1.492c3.632-1.102 8.147-.568 11.234 1.329a.78.78 0 0 1 .255 1.072Zm.105-2.835c-3.223-1.914-8.54-2.09-11.617-1.156a.934.934 0 1 1-.542-1.788c3.532-1.072 9.404-.865 13.115 1.338a.934.934 0 1 1-.956 1.606Z" />
    </svg>
  );
}

function YouTubeMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18.4a8.4 8.4 0 1 1 0-16.8 8.4 8.4 0 0 1 0 16.8ZM9.9 8.1v7.8L16.5 12 9.9 8.1Z" />
    </svg>
  );
}

function AppleMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.69-.84 1.16-2.01 1.03-3.18-.99.04-2.2.66-2.91 1.49-.64.73-1.2 1.92-1.05 3.06 1.11.09 2.24-.53 2.93-1.37z" />
    </svg>
  );
}

const linkClass =
  "group inline-flex items-center justify-center rounded-full p-2 sm:px-2.5 sm:py-1 text-[0.68rem] font-medium tracking-wide text-cream/65 bg-white/5 sm:bg-transparent border border-white/10 sm:border-transparent transition-all duration-200 hover:text-cream hover:bg-white/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40";

export function MusicLinks() {
  return (
    <nav aria-label="Playlists elsewhere" className="flex items-center gap-1.5 sm:gap-2.5">
      <a
        href={externalLinks.spotify}
        target="_blank"
        rel="noreferrer noopener"
        className={linkClass}
        aria-label="Open the playlist on Spotify"
        title="Spotify"
      >
        <span className="text-cream/80 transition-colors duration-300 group-hover:text-cream">
          <SpotifyIcon />
        </span>
        <span className="hidden sm:inline ml-1.5">Spotify</span>
      </a>
      <a
        href={externalLinks.youtubeMusic}
        target="_blank"
        rel="noreferrer noopener"
        className={linkClass}
        aria-label="Open the playlist on YouTube Music"
        title="YouTube Music"
      >
        <span className="text-cream/80 transition-colors duration-300 group-hover:text-cream">
          <YouTubeMusicIcon />
        </span>
        <span className="hidden sm:inline ml-1.5">YouTube Music</span>
      </a>
      <a
        href={externalLinks.appleMusic}
        target="_blank"
        rel="noreferrer noopener"
        className={linkClass}
        aria-label="Open the playlist on Apple Music"
        title="Apple Music"
      >
        <span className="text-cream/80 transition-colors duration-300 group-hover:text-cream">
          <AppleMusicIcon />
        </span>
        <span className="hidden sm:inline ml-1.5">Apple Music</span>
      </a>
    </nav>
  );
}
