import { useCallback, useEffect, useRef, useState } from "react";
import type { Track } from "@/data/playlist";
import { extractID3Metadata, type ID3Metadata } from "@/lib/id3";

/**
 * Fisher-Yates unbiased shuffle algorithm.
 * Generates an independent randomized track order per browser session.
 */
function shuffleArray(size: number): number[] {
  const array = Array.from({ length: size }, (_, i) => i);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j]!, array[i]!];
  }
  return array;
}

export function useAudioPlayer(playlist: Track[]) {
  // Single Audio instance ref to guarantee zero competing audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Session-unique shuffle order
  const shuffleOrder = useRef<number[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  // Flags for automatic playback transitions
  const autoPlayNextRef = useRef(false);
  const failedAttemptsRef = useRef(0);

  // Playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);

  // Extracted ID3 metadata (Title, Artist, Cover Artwork)
  const [id3Meta, setId3Meta] = useState<ID3Metadata | null>(null);

  // Initialize Fisher-Yates shuffle order once per session
  useEffect(() => {
    if (playlist.length > 0 && shuffleOrder.current.length === 0) {
      shuffleOrder.current = shuffleArray(playlist.length);
    }
  }, [playlist.length]);

  // Current track resolved from the shuffled queue
  const currentTrackIndex = shuffleOrder.current[queueIndex] ?? 0;
  const currentTrack = playlist[currentTrackIndex] ?? playlist[0];

  // Ref to hold current next callback to prevent stale closures in event listeners
  const nextRef = useRef<() => void>(() => {});

  // Define next track callback
  const next = useCallback((autoPlay = true) => {
    autoPlayNextRef.current = autoPlay;

    setQueueIndex((prev) => {
      const nextIdx = prev + 1;
      if (nextIdx >= shuffleOrder.current.length) {
        shuffleOrder.current = shuffleArray(playlist.length);
        return 0;
      }
      return nextIdx;
    });
  }, [playlist.length]);

  // Keep nextRef updated
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
    };

    const onLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
      setIsLoading(false);
      setError(false);
    };

    const onEnded = () => {
      // Automatically advance & play next track on completion
      autoPlayNextRef.current = true;
      setIsPlaying(false);
      nextRef.current();
    };

    const onError = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setError(true);
      failedAttemptsRef.current += 1;

      // Automatically attempt to skip to next track if failedAttempts < 3
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

  // Load current track into the single audio element & extract ID3 tags
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    let isSubscribed = true;
    const shouldAutoPlay = autoPlayNextRef.current;

    // Reset progress & error
    setProgress(0);
    setDuration(0);
    setError(false);
    setIsLoading(true);
    setId3Meta(null);

    // Update single audio source
    audio.pause();
    audio.src = currentTrack.audio;
    audio.load();

    // If autoPlay is set, trigger play immediately after setting src
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

    // Extract ID3 metadata & cover art on demand
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
  }, []);

  const previous = useCallback(() => {
    const audio = audioRef.current;
    const wasPlaying = isPlaying || (audio ? !audio.paused : true);
    autoPlayNextRef.current = wasPlaying;

    setQueueIndex((prev) => (prev > 0 ? prev - 1 : shuffleOrder.current.length - 1));
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

  // Display metadata (prefer ID3 tags, fallback to track properties)
  const displayTitle = id3Meta?.title || currentTrack?.title || "Digital Bus Track";
  const displayArtist = id3Meta?.artist || currentTrack?.artist || "Driver's Radio";
  const displayCover = id3Meta?.coverUrl || currentTrack?.cover || "/bus-stop-bg.jpg";

  return {
    track: currentTrack,
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
