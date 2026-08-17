import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "@/data/playlist";
import { setAmbientVolume, startAmbientBus, stopAmbientBus } from "@/lib/audioEffects";

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
  loadPlaylist: (
    playlist:
      | string
      | string[]
      | { list: string; listType?: string; index?: number; startSeconds?: number },
    index?: number,
    startSeconds?: number,
  ) => void;
  cuePlaylist: (
    playlist:
      | string
      | string[]
      | { list: string; listType?: string; index?: number; startSeconds?: number },
    index?: number,
    startSeconds?: number,
  ) => void;
  getPlaylist: () => string[];
  getPlaylistIndex: () => number;
  playVideoAt: (index: number) => void;
  nextVideo: () => void;
  previousVideo: () => void;
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
let ytScriptLoaded = false;
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
      ytScriptLoaded = true;
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

export function useAudioPlayer(playlist: Track[]) {
  const ytPlayerRef = useRef<YTPlayer | null>(null);
  const isPlayerReadyRef = useRef(false);

  // Single Authoritative State: activeTrackIndex is what is confirmed and rendered in UI
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  // Request token and pending track index to handle race conditions
  const playbackRequestIdRef = useRef(0);
  const requestedTrackIndexRef = useRef(0);
  const activeTrackIndexRef = useRef(0);

  // Keep ref synchronized with active state
  useEffect(() => {
    activeTrackIndexRef.current = activeTrackIndex;
  }, [activeTrackIndex]);

  const autoPlayNextRef = useRef(false);
  const failedAttemptsRef = useRef(0);
  const isDraggingRef = useRef(false);
  const historyRef = useRef<number[]>([]);
  const isShuffleRef = useRef(false);

  // Shuffled Queue State
  const shuffledQueueRef = useRef<number[]>([]);
  const queuePointerRef = useRef(0);

  const setDraggingState = useCallback((dragging: boolean) => {
    isDraggingRef.current = dragging;
  }, []);

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const [isAmbientEnabled, setIsAmbientEnabled] = useState(false);

  /** Generate a shuffled queue starting with the current track */
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

      // Check URL query parameters for ?song=ID; keep ?track=ID for older shared links
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

      requestedTrackIndexRef.current = initialIdx;
      setActiveTrackIndex(initialIdx);
      activeTrackIndexRef.current = initialIdx;
      initShuffledQueue(initialIdx, playlist.length);
    } catch {
      // Ignore storage errors
    }
  }, [playlist, initShuffledQueue]);

  // Derived current active track from single source of truth
  const safeActiveIndex = activeTrackIndex < playlist.length ? activeTrackIndex : 0;
  const currentTrack = playlist[safeActiveIndex] ?? playlist[0];

  /**
   * Helper to confirm and sync active track from YouTube player events
   */
  const syncTrackFromPlayer = useCallback(
    (player: YTPlayer, requestId: number, requestedIndex: number) => {
      // If a newer request was dispatched after this one, ignore this event
      if (requestId !== playbackRequestIdRef.current) {
        return;
      }

      let videoId: string | undefined;
      try {
        const data = player.getVideoData();
        videoId = data?.video_id;
      } catch {
        // Ignore
      }

      // If videoId is missing or matches requested track, trust requestedIndex
      let matchedIndex = requestedIndex;

      if (videoId) {
        const targetTrack = playlist[requestedIndex];
        if (targetTrack && targetTrack.youtubeId === videoId) {
          matchedIndex = requestedIndex;
        } else {
          // Find first track that matches videoId
          const found = playlist.findIndex((t) => t.youtubeId === videoId);
          if (found !== -1) {
            matchedIndex = found;
          }
        }
      }

      if (matchedIndex >= 0 && matchedIndex < playlist.length) {
        setActiveTrackIndex(matchedIndex);
        activeTrackIndexRef.current = matchedIndex;
        try {
          localStorage.setItem(STORAGE_INDEX_KEY, String(matchedIndex));
        } catch {
          // Ignore
        }
      }

      // Development invariant check & logging
      if (import.meta.env.DEV) {
        console.debug("[DigitalBus Player]", {
          event: "synced",
          videoId,
          activeTrackIndex: matchedIndex,
          trackTitle: playlist[matchedIndex]?.title,
          requestId,
        });

        if (videoId && playlist[matchedIndex]?.youtubeId !== videoId) {
          console.warn(
            `[DigitalBus Player] Mismatch: Active track ${playlist[matchedIndex]?.title} has ID ${playlist[matchedIndex]?.youtubeId} but player returned ${videoId}`,
          );
        }
      }
    },
    [playlist],
  );

  /** Centralized track request function */
  const playTrack = useCallback(
    (index: number, autoPlay = true) => {
      if (index < 0 || index >= playlist.length) return;

      const targetTrack = playlist[index];
      if (!targetTrack) return;

      // 1. Generate new request token
      playbackRequestIdRef.current += 1;
      const currentRequestId = playbackRequestIdRef.current;
      requestedTrackIndexRef.current = index;
      autoPlayNextRef.current = autoPlay;

      // Record history
      historyRef.current.push(activeTrackIndexRef.current);

      if (isShuffleRef.current) {
        initShuffledQueue(index, playlist.length);
      }

      // 2. Set transient loading & reset progress
      setIsLoading(true);
      setError(false);
      setProgress(0);
      setDuration(0);

      if (import.meta.env.DEV) {
        console.debug("[DigitalBus Player]", {
          event: "requestTrack",
          targetIndex: index,
          title: targetTrack.title,
          youtubeId: targetTrack.youtubeId,
          requestId: currentRequestId,
        });
      }

      // 3. Issue command to YouTube player
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
            console.warn("Error calling loadVideoById:", e);
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
      const currentIdx = requestedTrackIndexRef.current;

      if (isShuffleRef.current) {
        if (shuffledQueueRef.current.length !== playlist.length) {
          initShuffledQueue(currentIdx, playlist.length);
        }

        queuePointerRef.current += 1;
        if (queuePointerRef.current >= shuffledQueueRef.current.length) {
          // Cycle exhausted — recreate cycle
          initShuffledQueue(currentIdx, playlist.length);
          queuePointerRef.current = Math.min(1, shuffledQueueRef.current.length - 1);
        }

        nextIdx = shuffledQueueRef.current[queuePointerRef.current] ?? 0;
      } else {
        nextIdx = (currentIdx + 1) % playlist.length;
      }

      playTrack(nextIdx, autoPlay);
    },
    [playlist.length, initShuffledQueue, playTrack],
  );

  useEffect(() => {
    nextRef.current = () => next(true);
  }, [next]);

  const previous = useCallback(() => {
    let targetIdx: number;
    const currentIdx = requestedTrackIndexRef.current;

    if (isShuffleRef.current && historyRef.current.length > 0) {
      targetIdx = historyRef.current.pop()!;
    } else {
      targetIdx = currentIdx > 0 ? currentIdx - 1 : playlist.length - 1;
    }

    const wasPlaying =
      isPlaying ||
      (ytPlayerRef.current &&
        isPlayerReadyRef.current &&
        typeof ytPlayerRef.current.getPlayerState === "function" &&
        ytPlayerRef.current.getPlayerState() === 1);

    playTrack(targetIdx, !!wasPlaying);
  }, [playlist.length, isPlaying, playTrack]);

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

  // Expose global control methods & fake audio element on window for keyboard shortcuts & legacy scripts
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

    // Provide shim for window.digitalBusAudio
    w.digitalBusAudio = {
      get paused() {
        return !isPlaying;
      },
      get muted() {
        return isMuted;
      },
      set muted(val: boolean) {
        if (ytPlayerRef.current && isPlayerReadyRef.current) {
          if (val) ytPlayerRef.current.mute();
          else ytPlayerRef.current.unMute();
        }
        setIsMuted(val);
      },
      get currentTime() {
        return progress;
      },
      set currentTime(val: number) {
        if (ytPlayerRef.current && isPlayerReadyRef.current) {
          ytPlayerRef.current.seekTo(val, true);
          setProgress(val);
        }
      },
      get duration() {
        return duration;
      },
      play: async () => {
        if (ytPlayerRef.current && isPlayerReadyRef.current) {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
        }
      },
      pause: () => {
        if (ytPlayerRef.current && isPlayerReadyRef.current) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
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
  }, [isPlaying, isMuted, progress, duration, next, previous, toggleShuffle]);

  // Initialize YouTube Iframe Player in a hidden DOM element
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

      const initialTrack = playlist[requestedTrackIndexRef.current] || playlist[0];
      const initialVideoId = initialTrack?.youtubeId || "n4m5Jc24UvA";

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

              if (autoPlayNextRef.current) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: { data: number; target: YTPlayer }) => {
              if (!isSubscribed) return;
              const state = event.data;
              const YT = window.YT?.PlayerState;
              if (!YT) return;

              const currentReqId = playbackRequestIdRef.current;
              const requestedIdx = requestedTrackIndexRef.current;

              if (state === YT.PLAYING) {
                syncTrackFromPlayer(event.target, currentReqId, requestedIdx);
                setIsPlaying(true);
                setIsLoading(false);
                setError(false);
                failedAttemptsRef.current = 0;

                const dur = event.target.getDuration();
                if (dur && Number.isFinite(dur) && dur > 0) {
                  setDuration(dur);
                }
              } else if (state === YT.PAUSED) {
                setIsPlaying(false);
                setIsLoading(false);
              } else if (state === YT.BUFFERING) {
                setIsLoading(true);
                // Also sync metadata on buffering if request matches
                syncTrackFromPlayer(event.target, currentReqId, requestedIdx);
              } else if (state === YT.ENDED) {
                setIsPlaying(false);
                autoPlayNextRef.current = true;
                nextRef.current();
              } else if (state === YT.CUED) {
                syncTrackFromPlayer(event.target, currentReqId, requestedIdx);
                setIsLoading(false);
                if (autoPlayNextRef.current) {
                  event.target.playVideo();
                }
              }
            },
            onError: (event: { data: number; target: YTPlayer }) => {
              if (!isSubscribed) return;
              console.warn("YouTube player error event code:", event.data);
              setIsPlaying(false);
              setIsLoading(false);
              setError(true);
              failedAttemptsRef.current += 1;

              // Error codes: 2 (invalid param), 5 (HTML5 error), 100 (not found), 101/150 (not allowed in embedded players)
              // Gracefully advance to next video if error occurs (up to 4 consecutive attempts)
              if (failedAttemptsRef.current < 4) {
                setTimeout(() => {
                  if (isSubscribed) {
                    autoPlayNextRef.current = true;
                    nextRef.current();
                  }
                }, 1200);
              }
            },
          },
        });
      } catch (err) {
        console.warn("Error initializing YouTube Player:", err);
      }
    });

    return () => {
      isSubscribed = false;
    };
  }, [playlist, syncTrackFromPlayer]);

  // Poll current playback progress from YouTube player at 4Hz (250ms)
  useEffect(() => {
    const interval = setInterval(() => {
      const player = ytPlayerRef.current;
      if (!player || !isPlayerReadyRef.current) return;

      if (!isDraggingRef.current && typeof player.getCurrentTime === "function") {
        try {
          const current = player.getCurrentTime();
          const dur = player.getDuration();

          if (Number.isFinite(current)) {
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
      autoPlayNextRef.current = true;
      player.playVideo();
      setIsPlaying(true);
      setIsLoading(false);
      if (isAmbientEnabled) {
        setAmbientVolume(0.06);
      }
    }
  }, [isPlaying, isAmbientEnabled]);

  const retry = useCallback(() => {
    const player = ytPlayerRef.current;
    if (!player || !currentTrack || !isPlayerReadyRef.current) return;
    setError(false);
    setIsLoading(true);
    failedAttemptsRef.current = 0;
    autoPlayNextRef.current = true;
    player.loadVideoById(currentTrack.youtubeId || "n4m5Jc24UvA", 0);
  }, [currentTrack]);

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
    playTrack,
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
