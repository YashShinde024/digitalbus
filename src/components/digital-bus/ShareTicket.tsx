import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, Share2, Ticket, X as XIcon, MoreHorizontal } from "lucide-react";
import type { Track } from "@/data/playlist";
import { FALLBACK_ARTWORK, externalLinks } from "@/data/playlist";

type WindowWithToast = Window & {
  digitalBusTriggerToast?: (type: string, message?: string) => void;
};

type Props = {
  currentTrack?: Track;
  hiddenOnMobile?: boolean;
};

/* ──── Inline SVG Icons for Social & Music Platforms ──── */

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function XTwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.586 14.424a.622.622 0 0 1-.857.207c-2.348-1.435-5.304-1.76-8.785-.964a.623.623 0 1 1-.277-1.215c3.809-.871 7.077-.496 9.712 1.115a.623.623 0 0 1 .207.857Zm1.223-2.722a.78.78 0 0 1-1.072.257c-2.688-1.652-6.786-2.131-9.965-1.166a.78.78 0 1 1-.452-1.492c3.632-1.102 8.147-.568 11.234 1.329a.78.78 0 0 1 .255 1.072Zm.105-2.835c-3.223-1.914-8.54-2.09-11.617-1.156a.934.934 0 1 1-.542-1.788c3.532-1.072 9.404-.865 13.115 1.338a.934.934 0 1 1-.956 1.606Z" />
    </svg>
  );
}

function YouTubeMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18.4a8.4 8.4 0 1 1 0-16.8 8.4 8.4 0 0 1 0 16.8ZM9.9 8.1v7.8L16.5 12 9.9 8.1Z" />
    </svg>
  );
}

function AppleMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.69-.84 1.16-2.01 1.03-3.18-.99.04-2.2.66-2.91 1.49-.64.73-1.2 1.92-1.05 3.06 1.11.09 2.24-.53 2.93-1.37z" />
    </svg>
  );
}

export function ShareTicket({ currentTrack, hiddenOnMobile = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof navigator !== "undefined" && Boolean(navigator.share)) {
      setCanNativeShare(true);
    }
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  // Close modal on outside backdrop click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const triggerToast = useCallback((msg: string) => {
    const w = window as unknown as WindowWithToast;
    w.digitalBusTriggerToast?.("custom_banner", msg);
  }, []);

  const songTitle = currentTrack?.title || "Aapke Pyaar Mein Hum";
  const artistName = currentTrack?.artist || "Alka Yagnik";
  const albumName = currentTrack?.album || "Retro Bus Collection";
  const coverUrl = currentTrack?.cover || FALLBACK_ARTWORK;
  const trackId = currentTrack?.id ?? 1;

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/?song=${trackId}`
    : `https://digitalbus.me/?song=${trackId}`;

  const shareTitle = `Digital Bus — ${songTitle}`;
  const shareText = `Now playing "${songTitle}" by ${artistName} on Digital Bus — a nostalgic Hindi bus journey playlist.`;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      triggerToast("Ticket link copied to clipboard ✦");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      triggerToast("Ticket link copied to clipboard ✦");
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl, triggerToast]);

  const handleNativeShare = useCallback(async () => {
    if (canNativeShare) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        triggerToast("Ticket shared successfully ✦");
      } catch {
        // User cancelled share dialog
      }
    } else {
      await handleCopyLink();
    }
  }, [canNativeShare, shareTitle, shareText, shareUrl, triggerToast, handleCopyLink]);

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const xShareUrl = `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

  return (
    <>
      {/* Physical Ticket Trigger Control */}
      <div className={`fixed left-3 top-[calc(env(safe-area-inset-top)+8.25rem)] z-20 sm:left-auto sm:right-6 sm:top-1/2 sm:z-[35] sm:-translate-y-1/2 ${hiddenOnMobile ? "max-sm:hidden" : ""}`}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          id="share-ticket-button"
          aria-label="Share Digital Bus ticket modal"
          className="ticket-notch group relative overflow-visible rounded-xl border border-white/20
            bg-ink/85 sm:bg-ink/90 backdrop-blur-md
            p-2.5 sm:px-4 sm:py-3.5
            text-cream shadow-2xl transition-all duration-300 ease-out
            hover:border-white/40 hover:bg-ink/95 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.6)]
            active:scale-98
            focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
        >
          <div className="flex flex-col gap-1 w-[96px] sm:w-[145px] select-none text-left">
            <div className="flex items-center justify-between">
              <span className="text-[0.48rem] sm:text-[0.55rem] font-bold tracking-[0.2em] text-cream/40 uppercase flex items-center gap-1">
                <Ticket className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-amber-300/80" /> TICKET
              </span>
              <span className="text-[0.45rem] sm:text-[0.52rem] font-semibold text-amber-300/80 tracking-wider uppercase">
                ONE WAY
              </span>
            </div>

            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              <span className="text-[0.68rem] sm:text-[0.78rem] font-bold tracking-wide text-cream group-hover:text-amber-200 transition-colors">
                SHARE RIDE
              </span>
              <Share2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-cream/60 group-hover:text-cream group-hover:scale-110 transition-all" />
            </div>

            <div className="ticket-perforation mt-1 pt-1 flex items-center justify-between">
              <span className="text-[0.42rem] sm:text-[0.5rem] tracking-[0.2em] text-cream/35 uppercase font-semibold">
                DIGITAL BUS
              </span>
              <span className="text-[0.48rem] sm:text-[0.55rem] font-bold text-cream/50 group-hover:translate-x-0.5 transition-transform">
                ↗
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Retro Digital Bus Ticket Modal Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Digital Bus Ticket Share Modal"
          className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
        >
          <div
            ref={modalRef}
            className="relative w-full max-w-[420px] max-h-[min(92svh,720px)] overflow-y-auto hide-scrollbar rounded-[24px]
              border border-amber-500/25 bg-[#1a120c]/95 text-cream shadow-[0_25px_60px_rgba(0,0,0,0.85)]
              backdrop-blur-2xl transition-all duration-300 animate-scale-in"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close share ticket modal"
              className="absolute right-3.5 top-3.5 z-10 grid h-8 w-8 place-items-center rounded-full text-cream/50 transition-colors hover:bg-white/10 hover:text-cream focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/40 active:scale-95"
            >
              <XIcon className="h-4 w-4" />
            </button>

            {/* Retro Bus Ticket Body Container */}
            <div className="p-5 sm:p-6 flex flex-col gap-4 select-none">

              {/* Ticket Top Header & Branding */}
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex flex-col">
                  <span className="text-[0.55rem] font-bold tracking-[0.25em] text-amber-400/80 uppercase">
                    INDIAN STATE TRANSPORT • PASS
                  </span>
                  <h3 className="font-display text-[1.4rem] tracking-wide text-cream leading-tight">
                    डिजिटल बस <span className="text-xs font-sans font-normal text-cream/50">#90s</span>
                  </h3>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded-md border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[0.58rem] font-semibold tracking-wider text-amber-300 uppercase">
                    TICKET #DB-1990
                  </span>
                  <p className="mt-0.5 text-[0.52rem] text-cream/40 uppercase tracking-widest font-mono">
                    ROUTE: RETRO HINDI
                  </p>
                </div>
              </div>

              {/* Main Ticket Artwork & Song Details */}
              <div className="flex items-center gap-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/40 border border-white/15 shadow-md">
                  <img
                    src={coverUrl}
                    onError={(e) => { e.currentTarget.src = FALLBACK_ARTWORK; }}
                    alt={`Artwork for ${songTitle}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-[0.52rem] font-semibold tracking-[0.18em] text-amber-300/80 uppercase">
                    NOW PLAYING ON BOARD
                  </span>
                  <h4 className="truncate text-[0.95rem] font-bold text-cream tracking-tight mt-0.5">
                    {songTitle}
                  </h4>
                  <p className="truncate text-[0.72rem] font-medium text-cream/65 mt-0.5">
                    {artistName}
                  </p>
                  <p className="truncate text-[0.62rem] text-cream/40 italic">
                    {albumName}
                  </p>
                </div>
              </div>

              {/* Perforation Divider Line */}
              <div className="relative flex items-center justify-between border-t border-dashed border-white/20 pt-3">
                <div className="absolute -left-7 h-5 w-5 rounded-full bg-black/80" />
                <div className="absolute -right-7 h-5 w-5 rounded-full bg-black/80" />
                <p className="mx-auto text-[0.65rem] italic text-amber-200/70 font-display tracking-wide text-center">
                  "A ride through old memories..."
                </p>
              </div>

              {/* Ticket Details Stub */}
              <div className="grid grid-cols-3 gap-2 rounded-lg bg-black/30 p-2.5 text-center border border-white/5 font-mono text-[0.6rem]">
                <div>
                  <span className="block text-[0.5rem] text-cream/35 uppercase">SEAT</span>
                  <span className="font-semibold text-cream/80">WINDOW</span>
                </div>
                <div className="border-x border-white/10">
                  <span className="block text-[0.5rem] text-cream/35 uppercase">FARE</span>
                  <span className="font-semibold text-amber-300">MEMORIES</span>
                </div>
                <div>
                  <span className="block text-[0.5rem] text-cream/35 uppercase">DESTINATION</span>
                  <span className="font-semibold text-cream/80">NOSTALGIA</span>
                </div>
              </div>

              {/* Share Platform Buttons Grid */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-[0.58rem] font-bold tracking-[0.18em] text-cream/45 uppercase text-center">
                  SHARE THIS TICKET VIA
                </span>

                <div className="grid grid-cols-4 gap-2">
                  {/* WhatsApp */}
                  <a
                    href={whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 p-2 text-cream/80 transition-all hover:bg-emerald-600/20 hover:border-emerald-500/40 hover:text-emerald-300 active:scale-95"
                    title="Share on WhatsApp"
                  >
                    <WhatsAppIcon />
                    <span className="text-[0.6rem] font-medium">WhatsApp</span>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={xShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 p-2 text-cream/80 transition-all hover:bg-white/15 hover:border-white/30 hover:text-cream active:scale-95"
                    title="Share on X"
                  >
                    <XTwitterIcon />
                    <span className="text-[0.6rem] font-medium">X</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={facebookShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 p-2 text-cream/80 transition-all hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-300 active:scale-95"
                    title="Share on Facebook"
                  >
                    <FacebookIcon />
                    <span className="text-[0.6rem] font-medium">Facebook</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href={telegramShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/5 p-2 text-cream/80 transition-all hover:bg-sky-500/20 hover:border-sky-400/40 hover:text-sky-300 active:scale-95"
                    title="Share on Telegram"
                  >
                    <TelegramIcon />
                    <span className="text-[0.6rem] font-medium">Telegram</span>
                  </a>
                </div>

                {/* Music Platforms Row */}
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <a
                    href={externalLinks.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 px-2.5 text-cream/80 transition-all hover:bg-emerald-500/15 hover:border-emerald-500/30 hover:text-emerald-300 active:scale-95 text-[0.65rem] font-medium"
                    title="Open playlist on Spotify"
                  >
                    <SpotifyIcon />
                    <span>Spotify</span>
                  </a>

                  <a
                    href={externalLinks.youtubeMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 px-2.5 text-cream/80 transition-all hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-300 active:scale-95 text-[0.65rem] font-medium"
                    title="Open playlist on YouTube Music"
                  >
                    <YouTubeMusicIcon />
                    <span>YT Music</span>
                  </a>

                  <a
                    href={externalLinks.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 px-2.5 text-cream/80 transition-all hover:bg-pink-500/15 hover:border-pink-500/30 hover:text-pink-300 active:scale-95 text-[0.65rem] font-medium"
                    title="Open playlist on Apple Music"
                  >
                    <AppleMusicIcon />
                    <span>Apple</span>
                  </a>
                </div>

                {/* Action Buttons: Copy Link & Native Share */}
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 py-2.5 px-3 text-xs font-semibold text-cream transition-all hover:bg-white/20 hover:border-white/35 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cream/50"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 text-cream/70" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-400/15 py-2.5 px-3.5 text-xs font-semibold text-amber-200 transition-all hover:bg-amber-400/25 hover:border-amber-400/50 active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300/50"
                    title="More Share Options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span>More</span>
                  </button>
                </div>
              </div>

              {/* Website Branding Link */}
              <div className="text-center border-t border-white/10 pt-2.5">
                <span className="text-[0.62rem] font-semibold text-cream/40 tracking-wider uppercase">
                  digitalbus.me
                </span>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
