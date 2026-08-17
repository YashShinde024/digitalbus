import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "@/data/playlist";
import { setAmbientVolume, startAmbientBus, stopAmbientBus } from "@/lib/audioEffects";
import { validatePlaylist } from "@/lib/playlistValidator";

const STORAGE_INDEX_KEY = "digital_bus_last_queue_index";
const STORAGE_TIME_KEY = "digital_bus_last_time";
const STORAGE_AMBIENT_KEY = "digital_bus_ambient_enabled";
const STORAGE_MUTED_KEY = "digital_bus_is_muted";
const STORAGE_SHUFFLE_KEY = "digital_bus_shuffle_enabled";

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        options: {
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayer }) => void;
            onStateChange?: (event: { data: number; target: YTPlayer }) => void;
            onError?: (event: { data: number; target: YTPlayer }) => void;
          };
        },
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  getPlayerState: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoData: () => { video_id?: string; title?: string; author?: string };
  getVideoUrl: () => string;
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  cueVideoById: (videoId: string, startSeconds?: number) => void;
  destroy: () => void;
}

/** Fisher-Yates shuffle helper function */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Load YouTube Iframe API Script once singleton */
let ytScriptLoading = false;
const ytReadyCallbacks: (() => void)[] = [];

function loadYouTubeIframeAPI(onReady: () => void) {
  if (typeof window === "undefined") return;

  if (window.YT && window.YT.Player) {
    onReady();
    return;
  }

  ytReadyCallbacks.push(onReady);

  if (!ytScriptLoading) {
    ytScriptLoading = true;
    const prevOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevOnReady) prevOnReady();
      while (ytReadyCallbacks.length > 0) {
        const cb = ytReadyCallbacks.shift();
        cb?.();
      }
    };

    // Check if tag is already present in DOM
    const existingTag = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!existingTag) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }
}

export type PlaybackRequest = {
  id: number;
  index: number;
  youtubeId: string;
  autoPlay: boolean;
};

export function useAudioPlayer(playlist: Track[]) {
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const isPlayerReadyRef = useRef(false);

  // Authoritative State: activeTrackIndex is what is confirmed and rendered in UI
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const activeTrackIndexRef = useRef(0);

  // Pending Track Index for transition UX (displays loading indicator on requested track)
  const [pendingTrackIndex, setPendingTrackIndex] = useState<number | null>(null);
  const pendingTrackIndexRef = useRef<number | null>(null);

  // Playback Request Token
  const playbackRequestIdRef = useRef(0);
  const currentRequestRef = useRef<PlaybackRequest | null>(null);

  // Dragging & Timer Refs
  const isDraggingRef = useRef(false);
  const errorSkipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failedVideoIdsRef = useRef<Set<string>>(new Set());

  // Navigation & Shuffle State
  const historyRef = useRef<number[]>([]);
  const isShuffleRef = useRef(false);
  const shuffledQueueRef = useRef<number[]>([]);
  const queuePointerRef = useRef(0);

  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);

  const [isShuffle, setIsShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  const [duration, setDuration] = useState(0);
  const durationRef = useRef(0);

  const [error, setError] = useState(false);
  const [isAmbientEnabled, setIsAmbientEnabled] = useState(false);

  // Synchronize state to refs for high-frequency access without recreation
  useEffect(() => {
    activeTrackIndexRef.current = activeTrackIndex;
  }, [activeTrackIndex]);

  useEffect(() => {
    pendingTrackIndexRef.current = pendingTrackIndex;
  }, [pendingTrackIndex]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  const setDraggingState = useCallback((dragging: boolean) => {
    isDraggingRef.current = dragging;
  }, []);

  /** Generate a shuffled queue starting with the given track */
  const initShuffledQueue = useCallback((startIdx: number, total: number) => {
    if (total <= 0) return;
    const indices = Array.from({ length: total }, (_, i) => i);
    const rest = indices.filter((i) => i !== startIdx);
    const shuffledRest = shuffleArray(rest);
    shuffledQueueRef.current = [startIdx, ...shuffledRest];
    queuePointerRef.current = 0;
  }, []);

  // Restore saved session index & preferences from localStorage / URL search params on mount
  useEffect(() => {
    if (typeof window === "undefined" || playlist.length === 0) return;

    // Run development-time playlist validation once
    if (import.meta.env.DEV) {
      const validation = validatePlaylist(playlist);
      if (!validation.isValid) {
        console.error("[DigitalBus Playlist Validation Failed]", validation.errors);
      }
    }

    try {
      const savedMuted = localStorage.getItem(STORAGE_MUTED_KEY);
      if (savedMuted === "true") {
        setIsMuted(true);
      }
      const savedAmbient = localStorage.getItem(STORAGE_AMBIENT_KEY);
      if (savedAmbient === "true") {
        setIsAmbientEnabled(true);
      }
      const savedShuffle = localStorage.getItem(STORAGE_SHUFFLE_KEY);
      if (savedShuffle === "true") {
        setIsShuffle(true);
        isShuffleRef.current = true;
      }

      let initialIdx = 0;
      const params = new URLSearchParams(window.location.search);
      const trackParam = params.get("song") ?? params.get("track");
      if (trackParam) {
        const foundIdx = playlist.findIndex((t) => String(t.id) === trackParam);
        if (foundIdx !== -1) {
          initialIdx = foundIdx;
        }
      } else {
        const savedIdx = localStorage.getItem(STORAGE_INDEX_KEY);
        if (savedIdx !== null) {
          const parsed = parseInt(savedIdx, 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed < playlist.length) {
            initialIdx = parsed;
          }
        }
      }

      setActiveTrackIndex(initialIdx);
      activeTrackIndexRef.current = initialIdx;
      currentRequestRef.current = {
        id: 0,
        index: initialIdx,
        youtubeId: playlist[initialIdx]?.youtubeId || "",
        autoPlay: false,
      };
      initShuffledQueue(initialIdx, playlist.length);
    } catch {
      // Ignore storage errors
    }
  }, [playlist, initShuffledQueue]);

  // Derived current active track from single source of truth
  const safeActiveIndex = activeTrackIndex < playlist.length ? activeTrackIndex : 0;
  const currentTrack = playlist[safeActiveIndex] ?? playlist[0];

  /** Centralized track request function */
  const playTrack = useCallback(
    (
      index: number,
      options: { autoPlay?: boolean; recordHistory?: boolean } = {},
    ) => {
      const { autoPlay = true, recordHistory = true } = options;

      if (index < 0 || index >= playlist.length) return;

      const targetTrack = playlist[index];
      if (!targetTrack) return;

      // 1. Cancel any pending error skip timer
      if (errorSkipTimerRef.current) {
        clearTimeout(errorSkipTimerRef.current);
        errorSkipTimerRef.current = null;
      }

      // 2. Record history if requested and moving to a different track
      if (recordHistory && activeTrackIndexRef.current !== index) {
        historyRef.current.push(activeTrackIndexRef.current);
      }

      // 3. Issue new request token
      playbackRequestIdRef.current += 1;
      const newRequestId = playbackRequestIdRef.current;
      const request: PlaybackRequest = {
        id: newRequestId,
        index,
        youtubeId: targetTrack.youtubeId,
        autoPlay,
      };
      currentRequestRef.current = request;

      // 4. Update transient loading state without committing activeTrackIndex yet
      setPendingTrackIndex(index);
      setIsLoading(true);
      setError(false);
      setProgress(0);
      setDuration(0);

      // If shuffle is active, ensure the queue pointer tracks this song if in queue
      if (isShuffleRef.current) {
        const ptr = shuffledQueueRef.current.indexOf(index);
        if (ptr !== -1) {
          queuePointerRef.current = ptr;
        } else {
          initShuffledQueue(index, playlist.length);
        }
      }

      // 5. Send command to player if ready
      const player = ytPlayerRef.current;
      if (player && isPlayerReadyRef.current) {
        try {
          if (autoPlay) {
            player.loadVideoById(targetTrack.youtubeId, 0);
          } else {
            player.cueVideoById(targetTrack.youtubeId, 0);
          }
        } catch {
          try {
            player.loadVideoById(targetTrack.youtubeId, 0);
          } catch (e) {
            console.warn("[DigitalBus Player] Error executing loadVideoById:", e);
          }
        }
      }
    },
    [playlist, initShuffledQueue],
  );

  const nextRef = useRef<() => void>(() => {});

  const next = useCallback(
    (autoPlay = true) => {
      let nextIdx: number;
      const currentIdx =
        pendingTrackIndexRef.current !== null
          ? pendingTrackIndexRef.current
          : activeTrackIndexRef.current;

      if (isShuffleRef.current) {
        if (shuffledQueueRef.current.length !== playlist.length) {
          initShuffledQueue(currentIdx, playlist.length);
        }

        queuePointerRef.current += 1;
        if (queuePointerRef.current >= shuffledQueueRef.current.length) {
          // Shuffled cycle exhausted — generate new cycle preserving current track first
          initShuffledQueue(currentIdx, playlist.length);
          queuePointerRef.current = Math.min(1, shuffledQueueRef.current.length - 1);
        }

        nextIdx = shuffledQueueRef.current[queuePointerRef.current] ?? 0;
      } else {
        nextIdx = (currentIdx + 1) % playlist.length;
      }

      playTrack(nextIdx, { autoPlay, recordHistory: true });
    },
    [playlist.length, initShuffledQueue, playTrack],
  );

  useEffect(() => {
    nextRef.current = () => next(true);
  }, [next]);

  const previous = useCallback(() => {
    let targetIdx: number;
    const currentIdx =
      pendingTrackIndexRef.current !== null
        ? pendingTrackIndexRef.current
        : activeTrackIndexRef.current;

    if (historyRef.current.length > 0) {
      targetIdx = historyRef.current.pop()!;
      // Update queue pointer if in shuffle mode
      if (isShuffleRef.current) {
        const ptr = shuffledQueueRef.current.indexOf(targetIdx);
        if (ptr !== -1) queuePointerRef.current = ptr;
      }
    } else if (isShuffleRef.current && queuePointerRef.current > 0) {
      queuePointerRef.current -= 1;
      targetIdx = shuffledQueueRef.current[queuePointerRef.current] ?? 0;
    } else {
      targetIdx = currentIdx > 0 ? currentIdx - 1 : playlist.length - 1;
    }

    const wasPlaying =
      isPlayingRef.current ||
      (ytPlayerRef.current &&
        isPlayerReadyRef.current &&
        typeof ytPlayerRef.current.getPlayerState === "function" &&
        ytPlayerRef.current.getPlayerState() === 1);

    playTrack(targetIdx, { autoPlay: !!wasPlaying, recordHistory: false });
  }, [playlist.length, playTrack]);

  const toggleShuffle = useCallback(() => {
    setIsShuffle((prev) => {
      const nextState = !prev;
      isShuffleRef.current = nextState;

      if (nextState) {
        initShuffledQueue(activeTrackIndexRef.current, playlist.length);
      }

      try {
        localStorage.setItem(STORAGE_SHUFFLE_KEY, String(nextState));
      } catch {
        // Ignore
      }
      return nextState;
    });
  }, [playlist.length, initShuffledQueue]);

  /**
   * Authoritative Active Track Confirmation
   * Confirms playback only when YouTube PLAYING event matches the current request
   */
  const confirmActivePlayback = useCallback(
    (player: YTPlayer) => {
      const req = currentRequestRef.current;
      if (!req) return;

      let actualVideoId: string | undefined;
      try {
        const data = player.getVideoData();
        actualVideoId = data?.video_id;
      } catch {
        // Ignore
      }

      // Map actualVideoId to playlist track
      let matchedIndex = req.index;
      if (actualVideoId) {
        const found = playlist.findIndex((t) => t.youtubeId === actualVideoId);
        if (found !== -1) {
          matchedIndex = found;
        } else if (req.youtubeId !== actualVideoId) {
          // Unmatched video ID from older request — reject
          return;
        }
      }

      // Commit confirmed state
      setActiveTrackIndex(matchedIndex);
      activeTrackIndexRef.current = matchedIndex;
      setPendingTrackIndex(null);
      pendingTrackIndexRef.current = null;
      setIsPlaying(true);
      setIsLoading(false);
      setError(false);

      const dur = player.getDuration();
      if (Number.isFinite(dur) && dur > 0) {
        setDuration(dur);
      }

      try {
        localStorage.setItem(STORAGE_INDEX_KEY, String(matchedIndex));
      } catch {
        // Ignore
      }
    },
    [playlist],
  );

  // Initialize YouTube IFrame Player in hidden container singleton
  useEffect(() => {
    if (typeof window === "undefined") return;

    let container = document.getElementById("digital-bus-yt-player");
    if (!container) {
      container = document.createElement("div");
      container.id = "digital-bus-yt-player";
      container.style.position = "fixed";
      container.style.bottom = "0";
      container.style.right = "0";
      container.style.width = "200px";
      container.style.height = "200px";
      container.style.opacity = "0.01";
      container.style.pointerEvents = "none";
      container.style.zIndex = "-9999";
      document.body.appendChild(container);
    }

    let isSubscribed = true;

    loadYouTubeIframeAPI(() => {
      if (!isSubscribed || ytPlayerRef.current) return;

      const initialTrack = playlist[activeTrackIndexRef.current] || playlist[0];
      const initialVideoId = initialTrack?.youtubeId || "L6bSHDaDLyc";

      try {
        const player = new window.YT!.Player("digital-bus-yt-player", {
          videoId: initialVideoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: { target: YTPlayer }) => {
              if (!isSubscribed) return;
              isPlayerReadyRef.current = true;
              ytPlayerRef.current = event.target;

              const savedMuted = localStorage.getItem(STORAGE_MUTED_KEY);
              if (savedMuted === "true") {
                event.target.mute();
                setIsMuted(true);
              }

              // Check if a request arrived before onReady
              const pendingReq = currentRequestRef.current;
              if (pendingReq) {
                if (pendingReq.autoPlay) {
                  event.target.loadVideoById(pendingReq.youtubeId, 0);
                } else if (pendingReq.youtubeId !== initialVideoId) {
                  event.target.cueVideoById(pendingReq.youtubeId, 0);
                }
              }
            },
            onStateChange: (event: { data: number; target: YTPlayer }) => {
              if (!isSubscribed) return;
              const state = event.data;
              const YT = window.YT?.PlayerState;
              if (!YT) return;

              if (state === YT.PLAYING) {
                confirmActivePlayback(event.target);
              } else if (state === YT.PAUSED) {
                setIsPlaying(false);
                setIsLoading(false);
              } else if (state === YT.BUFFERING) {
                setIsLoading(true);
              } else if (state === YT.ENDED) {
                setIsPlaying(false);
                nextRef.current();
              } else if (state === YT.CUED) {
                setIsLoading(false);
                const req = currentRequestRef.current;
                if (req && req.autoPlay) {
                  event.target.playVideo();
                }
              }
            },
            onError: (event: { data: number; target: YTPlayer }) => {
              if (!isSubscribed) return;
              const req = currentRequestRef.current;
              const failedVideoId = req?.youtubeId || "unknown";

              console.warn(
                `[DigitalBus Player] Error code ${event.data} for video ${failedVideoId} (Track: ${req?.index})`,
              );

              setIsPlaying(false);
              setIsLoading(false);
              setError(true);

              if (failedVideoId !== "unknown") {
                failedVideoIdsRef.current.add(failedVideoId);
              }

              // Cancel any existing error timer
              if (errorSkipTimerRef.current) {
                clearTimeout(errorSkipTimerRef.current);
                errorSkipTimerRef.current = null;
              }

              // Auto-advance to next track after 1200ms if not in infinite loop
              if (failedVideoIdsRef.current.size < playlist.length) {
                errorSkipTimerRef.current = setTimeout(() => {
                  if (isSubscribed) {
                    nextRef.current();
                  }
                }, 1200);
              }
            },
          },
        });
      } catch (err) {
        console.warn("[DigitalBus Player] Error initializing YouTube Player:", err);
      }
    });

    return () => {
      isSubscribed = false;
      if (errorSkipTimerRef.current) {
        clearTimeout(errorSkipTimerRef.current);
        errorSkipTimerRef.current = null;
      }
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch {
          // Ignore
        }
        ytPlayerRef.current = null;
        isPlayerReadyRef.current = false;
      }
    };
  }, [playlist, confirmActivePlayback]);

  // Poll current playback progress from YouTube player at 4Hz (250ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const player = ytPlayerRef.current;
      if (!player || !isPlayerReadyRef.current) return;

      if (!isDraggingRef.current && typeof player.getCurrentTime === "function") {
        try {
          const current = player.getCurrentTime();
          const dur = player.getDuration();

          if (Number.isFinite(current) && current >= 0) {
            setProgress(current);
          }
          if (Number.isFinite(dur) && dur > 0) {
            setDuration(dur);
          }

          if (Math.floor(current) % 5 === 0) {
            try {
              localStorage.setItem(STORAGE_TIME_KEY, String(current));
            } catch {
              // Ignore
            }
          }
        } catch {
          // Ignore
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Expose global control methods & fake audio element on window (stable reference reading current refs)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const w = window as unknown as Window & {
      digitalBusAudio?: {
        paused: boolean;
        muted: boolean;
        currentTime: number;
        duration: number;
        play: () => Promise<void>;
        pause: () => void;
      };
      digitalBusToggleMute?: () => void;
      digitalBusNextTrack?: () => void;
      digitalBusPreviousTrack?: () => void;
      digitalBusToggleShuffle?: () => void;
      digitalBusOpenPlaylist?: () => void;
      digitalBusOpenTicket?: () => void;
    };

    w.digitalBusAudio = {
      get paused() {
        return !isPlayingRef.current;
      },
      get muted() {
        return isMutedRef.current;
      },
      set muted(val: boolean) {
        if (ytPlayerRef.current && isPlayerReadyRef.current) {
          if (val) ytPlayerRef.current.mute();
          else ytPlayerRef.current.unMute();
        }
        setIsMuted(val);
      },
      get currentTime() {
        return progressRef.current;
      },
      set currentTime(val: number) {
        if (ytPlayerRef.current && isPlayerReadyRef.current) {
          ytPlayerRef.current.seekTo(val, true);
          setProgress(val);
        }
      },
      get duration() {
        return durationRef.current;
      },
      play: async () => {
        if (ytPlayerRef.current && isPlayerReadyRef.current) {
          ytPlayerRef.current.playVideo();
        }
      },
      pause: () => {
        if (ytPlayerRef.current && isPlayerReadyRef.current) {
          ytPlayerRef.current.pauseVideo();
        }
      },
    };

    w.digitalBusToggleMute = () => {
      setIsMuted((prev) => {
        const nextState = !prev;
        if (ytPlayerRef.current && isPlayerReadyRef.current) {
          if (nextState) {
            ytPlayerRef.current.mute();
          } else {
            ytPlayerRef.current.unMute();
          }
        }
        try {
          localStorage.setItem(STORAGE_MUTED_KEY, String(nextState));
        } catch {
          // Ignore
        }
        return nextState;
      });
    };

    w.digitalBusNextTrack = () => next(true);
    w.digitalBusPreviousTrack = () => previous();
    w.digitalBusToggleShuffle = () => toggleShuffle();

    return () => {
      delete w.digitalBusAudio;
      delete w.digitalBusToggleMute;
      delete w.digitalBusNextTrack;
      delete w.digitalBusPreviousTrack;
      delete w.digitalBusToggleShuffle;
    };
  }, [next, previous, toggleShuffle]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextState = !prev;
      const player = ytPlayerRef.current;
      if (player && isPlayerReadyRef.current) {
        if (nextState) {
          player.mute();
        } else {
          player.unMute();
        }
      }
      try {
        localStorage.setItem(STORAGE_MUTED_KEY, String(nextState));
      } catch {
        // Ignore
      }
      return nextState;
    });
  }, []);

  const toggleAmbient = useCallback(() => {
    setIsAmbientEnabled((prev) => {
      const nextState = !prev;
      try {
        localStorage.setItem(STORAGE_AMBIENT_KEY, String(nextState));
      } catch {
        // Ignore
      }

      if (nextState) {
        startAmbientBus(0.06);
      } else {
        stopAmbientBus();
      }
      return nextState;
    });
  }, []);

  const toggle = useCallback(() => {
    const player = ytPlayerRef.current;
    if (!player || !isPlayerReadyRef.current) return;

    if (isPlaying) {
      player.pauseVideo();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      player.playVideo();
      if (isAmbientEnabled) {
        setAmbientVolume(0.06);
      }
    }
  }, [isPlaying, isAmbientEnabled]);

  const retry = useCallback(() => {
    const targetIdx =
      pendingTrackIndexRef.current !== null
        ? pendingTrackIndexRef.current
        : activeTrackIndexRef.current;
    playTrack(targetIdx, { autoPlay: true, recordHistory: false });
  }, [playTrack]);

  const seek = useCallback(
    (ratio: number) => {
      const player = ytPlayerRef.current;
      if (!player || !isPlayerReadyRef.current || !duration) return;
      const t = Math.min(Math.max(ratio, 0), 1) * duration;
      player.seekTo(t, true);
      setProgress(t);
    },
    [duration],
  );

  const displayTitle = currentTrack?.title || "Digital Bus Track";
  const displayArtist = currentTrack?.artist || "Driver's Radio";
  const displayCover = currentTrack?.cover || "/covers/song-01.jpg";

  let nextTrackIndex: number;
  if (isShuffleRef.current && shuffledQueueRef.current.length > 0) {
    const nextPtr = (queuePointerRef.current + 1) % shuffledQueueRef.current.length;
    nextTrackIndex = shuffledQueueRef.current[nextPtr] ?? (safeActiveIndex + 1) % playlist.length;
  } else {
    nextTrackIndex = (safeActiveIndex + 1) % playlist.length;
  }

  const nextTrackPreviewTitle = playlist[nextTrackIndex]?.title || "Next Song";

  return {
    track: currentTrack,
    currentTrackIndex: safeActiveIndex,
    pendingTrackIndex,
    nextTrackTitle: nextTrackPreviewTitle,
    displayTitle,
    displayArtist,
    displayCover,
    totalTracks: playlist.length,
    isPlaying,
    isLoading,
    isMuted,
    isShuffle,
    progress,
    duration,
    error,
    isAmbientEnabled,
    toggleMute,
    toggleAmbient,
    toggleShuffle,
    toggle,
    next: () => next(true),
    previous,
    playTrack: (index: number, autoPlay = true) =>
      playTrack(index, { autoPlay, recordHistory: true }),
    retry,
    seek,
    setDraggingState,
  };
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
