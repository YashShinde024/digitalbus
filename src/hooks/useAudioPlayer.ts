import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "@/data/playlist";
import { setAmbientVolume, startAmbientBus, stopAmbientBus } from "@/lib/audioEffects";
import { extractID3Metadata, type ID3Metadata } from "@/lib/id3";

function shuffleArray(size: number): number[] {
  const array = Array.from({ length: size }, (_, i) => i);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
  return array;
}

const STORAGE_INDEX_KEY = "digital_bus_last_queue_index";
const STORAGE_TIME_KEY = "digital_bus_last_time";
const STORAGE_AMBIENT_KEY = "digital_bus_ambient_enabled";

export function useAudioPlayer(playlist: Track[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shuffleOrder = useRef<number[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const autoPlayNextRef = useRef(false);
  const failedAttemptsRef = useRef(0);

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const [isAmbientEnabled, setIsAmbientEnabled] = useState(false);

  // ID3 Metadata
  const [id3Meta, setId3Meta] = useState<ID3Metadata | null>(null);

  // Restore saved session index & ambient preference from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ambient sound preference
    try {
      const savedAmbient = localStorage.getItem(STORAGE_AMBIENT_KEY);
      if (savedAmbient === "true") {
        setIsAmbientEnabled(true);
      }
    } catch {
      // Ignore storage errors
    }

    // Queue shuffle order & index
    if (playlist.length > 0 && shuffleOrder.current.length === 0) {
      shuffleOrder.current = shuffleArray(playlist.length);
      try {
        const savedIdx = localStorage.getItem(STORAGE_INDEX_KEY);
        if (savedIdx !== null) {
          const parsed = parseInt(savedIdx, 10);
          if (!isNaN(parsed) && parsed >= 0 && parsed < playlist.length) {
            setQueueIndex(parsed);
          }
        }
      } catch {
        // Ignore storage errors
      }
    }
  }, [playlist.length]);

  // Current track resolved from shuffled queue
  const currentTrackIndex = shuffleOrder.current[queueIndex] ?? 0;
  const currentTrack = playlist[currentTrackIndex] ?? playlist[0];

  // Preview of the next track in shuffled queue
  const nextTrackIndex = shuffleOrder.current[(queueIndex + 1) % playlist.length] ?? 0;
  const nextTrack = playlist[nextTrackIndex];

  const nextRef = useRef<() => void>(() => {});

  const next = useCallback((autoPlay = true) => {
    autoPlayNextRef.current = autoPlay;
    setQueueIndex((prev) => {
      const nextIdx = prev + 1;
      let targetIndex = nextIdx;
      if (nextIdx >= shuffleOrder.current.length) {
        shuffleOrder.current = shuffleArray(playlist.length);
        targetIndex = 0;
      }
      try {
        localStorage.setItem(STORAGE_INDEX_KEY, String(targetIndex));
      } catch {
        // Ignore storage errors
      }
      return targetIndex;
    });
  }, [playlist.length]);

  useEffect(() => {
    nextRef.current = () => next(true);
  }, [next]);

  // Initialize single HTML5 Audio element & event listeners
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audioRef.current = audio;

    const onPlay = () => {
      setIsPlaying(true);
      setIsLoading(false);
      failedAttemptsRef.current = 0;
    };

    const onPause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    const onWaiting = () => {
      setIsLoading(true);
    };

    const onCanPlay = () => {
      setIsLoading(false);
      if (autoPlayNextRef.current) {
        void audio.play().catch(() => {
          setIsPlaying(false);
        });
      }
    };

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
      if (audio.duration && Number.isFinite(audio.duration)) {
        setDuration(audio.duration);
      }
      // Save currentTime periodically
      if (Math.floor(audio.currentTime) % 5 === 0) {
        try {
          localStorage.setItem(STORAGE_TIME_KEY, String(audio.currentTime));
        } catch {
          // Ignore
        }
      }
    };

    const onLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setIsLoading(false);
      setError(false);
    };

    const onEnded = () => {
      autoPlayNextRef.current = true;
      setIsPlaying(false);
      nextRef.current();
    };

    const onError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setError(true);
      failedAttemptsRef.current += 1;

      if (failedAttemptsRef.current < 3) {
        setTimeout(() => {
          autoPlayNextRef.current = true;
          nextRef.current();
        }, 1000);
      }
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("canplay", onCanPlay);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("canplay", onCanPlay);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
      audio.pause();
      audio.src = "";
    };
  }, []);

  // Load current track into single audio element & extract ID3 tags
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    let isSubscribed = true;
    const shouldAutoPlay = autoPlayNextRef.current;

    setProgress(0);
    setDuration(0);
    setError(false);
    setIsLoading(true);
    setId3Meta(null);

    audio.pause();
    audio.src = currentTrack.audio;
    audio.load();

    if (shouldAutoPlay) {
      void audio.play().then(() => {
        if (isSubscribed) {
          setIsPlaying(true);
          setIsLoading(false);
        }
      }).catch((err) => {
        console.warn("Autoplay transition catch:", err);
      });
    }

    void extractID3Metadata(currentTrack.audio).then((meta) => {
      if (isSubscribed) {
        setId3Meta(meta);
      }
    });

    return () => {
      isSubscribed = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueIndex, currentTrack?.audio]);

  // Ambient sound toggle handler
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

  // Controls
  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      setIsLoading(true);
      autoPlayNextRef.current = false;
      void audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsLoading(false);
          if (isAmbientEnabled) {
            setAmbientVolume(0.06);
          }
        })
        .catch((err) => {
          console.warn("Autoplay / Play rejected:", err);
          setIsPlaying(false);
          setIsLoading(false);
        });
    } else {
      audio.pause();
      setIsPlaying(false);
      setIsLoading(false);
    }
  }, [isAmbientEnabled]);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    const wasPlaying = isPlaying || (audio ? !audio.paused : true);
    autoPlayNextRef.current = wasPlaying;

    setQueueIndex((prev) => {
      const targetIndex = prev > 0 ? prev - 1 : shuffleOrder.current.length - 1;
      try {
        localStorage.setItem(STORAGE_INDEX_KEY, String(targetIndex));
      } catch {
        // Ignore
      }
      return targetIndex;
    });
  }, [isPlaying]);

  const retry = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    setError(false);
    setIsLoading(true);
    failedAttemptsRef.current = 0;
    autoPlayNextRef.current = true;
    audio.src = currentTrack.audio;
    audio.load();
    void audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch(() => {
        setIsPlaying(false);
        setIsLoading(false);
        setError(true);
      });
  }, [currentTrack]);

  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const t = Math.min(Math.max(ratio, 0), 1) * audio.duration;
    audio.currentTime = t;
    setProgress(t);
  }, []);

  const displayTitle = id3Meta?.title || currentTrack?.title || "Digital Bus Track";
  const displayArtist = id3Meta?.artist || currentTrack?.artist || "Driver's Radio";
  const displayCover = id3Meta?.coverUrl || currentTrack?.cover || "/bus-stop-bg.jpg";
  const nextTrackPreviewTitle = nextTrack?.title || "Next Song";

  return {
    track: currentTrack,
    nextTrackTitle: nextTrackPreviewTitle,
    displayTitle,
    displayArtist,
    displayCover,
    queueIndex,
    totalTracks: playlist.length,
    isPlaying,
    isLoading,
    progress,
    duration,
    error,
    isAmbientEnabled,
    toggleAmbient,
    toggle,
    next: () => next(true),
    previous,
    retry,
    seek,
  };
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
