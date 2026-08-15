import { externalLinks } from "@/data/playlist";

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.586 14.424a.622.622 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 1 1-.277-1.215c3.809-.871 7.077-.496 9.712 1.115a.623.623 0 0 1 .207.857Zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.688-1.652-6.786-2.131-9.965-1.166a.78.78 0 1 1-.452-1.492c3.632-1.102 8.147-.568 11.234 1.329a.78.78 0 0 1 .255 1.072Zm.105-2.835c-3.223-1.914-8.54-2.09-11.617-1.156a.934.934 0 1 1-.542-1.788c3.532-1.072 9.404-.865 13.115 1.338a.934.934 0 1 1-.956 1.606Z" />
    </svg>
  );
}

function YouTubeMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18.4a8.4 8.4 0 1 1 0-16.8 8.4 8.4 0 0 1 0 16.8ZM9.9 8.1v7.8L16.5 12 9.9 8.1Z" />
    </svg>
  );
}

function AppleMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10zm4.2 14.5c-.5.8-1.1 1.6-2 .16-1 .02-1.3-.52-2.3-.52-1 0-1.4.5-2.2.53-.9.03-1.6-.9-2.1-1.7-1.2-1.8-2-4.9-.8-6.9.6-1 1.6-1.6 2.7-1.6.8 0 1.6.6 2.1.6.5 0 1.5-.7 2.5-.6.4 0 1.6.2 2.4 1.3-.1.1-1.4.8-1.4 2.5.02 2 1.7 2.6 1.8 2.7-.02.05-.3 1-.7 1.9zm-1.8-8.6c.4-.5.7-1.3.6-2-.6.03-1.4.4-1.9 1-.4.5-.8 1.3-.7 2.1.7.06 1.5-.3 2-.9z" />
    </svg>
  );
}

const linkClass =
  "group inline-flex items-center justify-center rounded-full p-2 sm:px-3 sm:py-1.5 text-[0.72rem] font-medium tracking-wide text-cream/70 bg-white/5 sm:bg-transparent border border-white/10 sm:border-transparent transition-all duration-200 hover:text-cream hover:bg-white/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40";

export function MusicLinks() {
  return (
    <nav aria-label="Playlists elsewhere" className="flex items-center gap-1 sm:gap-2">
      <a
        href={externalLinks.spotify}
        target="_blank"
        rel="noreferrer noopener"
        className={linkClass}
        aria-label="Open the playlist on Spotify"
        title="Spotify"
      >
        <span className="flex items-center justify-center text-cream/80 transition-colors duration-300 group-hover:text-cream">
          <SpotifyIcon />
        </span>
        <span className="hidden sm:inline ml-1.5 leading-none">Spotify</span>
      </a>
      <a
        href={externalLinks.youtubeMusic}
        target="_blank"
        rel="noreferrer noopener"
        className={linkClass}
        aria-label="Open the playlist on YouTube Music"
        title="YouTube Music"
      >
        <span className="flex items-center justify-center text-cream/80 transition-colors duration-300 group-hover:text-cream">
          <YouTubeMusicIcon />
        </span>
        <span className="hidden sm:inline ml-1.5 leading-none">YouTube Music</span>
      </a>
      <a
        href={externalLinks.appleMusic}
        target="_blank"
        rel="noreferrer noopener"
        className={linkClass}
        aria-label="Open the playlist on Apple Music"
        title="Apple Music"
      >
        <span className="flex items-center justify-center text-cream/80 transition-colors duration-300 group-hover:text-cream">
          <AppleMusicIcon />
        </span>
        <span className="hidden sm:inline ml-1.5 leading-none">Apple Music</span>
      </a>
    </nav>
  );
}
