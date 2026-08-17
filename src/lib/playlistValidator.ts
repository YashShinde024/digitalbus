import type { Track } from "@/data/playlist";

export type ValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  trackCount: number;
};

export function validatePlaylist(tracks: Track[]): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!tracks || tracks.length !== 77) {
    errors.push(`Expected exactly 77 tracks in playlist, found ${tracks?.length ?? 0}`);
  }

  const seenIds = new Set<number>();
  const seenYoutubeIds = new Map<string, number>();

  for (let i = 0; i < (tracks?.length ?? 0); i++) {
    const t = tracks[i];
    const trackNum = t?.id ?? i + 1;

    // Check Track ID
    if (typeof t.id !== "number" || t.id <= 0) {
      errors.push(`Track at index ${i} has invalid id: ${t.id}`);
    } else if (seenIds.has(t.id)) {
      errors.push(`Duplicate track id ${t.id} found at index ${i}`);
    } else {
      seenIds.add(t.id);
    }

    // Check Title
    if (!t.title || typeof t.title !== "string" || t.title.trim().length === 0) {
      errors.push(`Track ${trackNum} is missing title`);
    }

    // Check Artist
    if (!t.artist || typeof t.artist !== "string" || t.artist.trim().length === 0) {
      errors.push(`Track ${trackNum} is missing artist`);
    }

    // Check Cover
    if (!t.cover || typeof t.cover !== "string" || t.cover.trim().length === 0) {
      warnings.push(`Track ${trackNum} is missing cover artwork path`);
    }

    // Check YouTube ID syntax
    if (!t.youtubeId || typeof t.youtubeId !== "string") {
      errors.push(`Track ${trackNum} ("${t.title}") has missing youtubeId`);
    } else if (t.youtubeId.length !== 11) {
      errors.push(
        `Track ${trackNum} ("${t.title}") has invalid youtubeId length (${t.youtubeId.length} != 11): "${t.youtubeId}"`,
      );
    } else if (/^[a-z]+$/.test(t.youtubeId) || t.youtubeId.includes("abcdef")) {
      errors.push(
        `Track ${trackNum} ("${t.title}") has placeholder/fake pattern youtubeId: "${t.youtubeId}"`,
      );
    } else if (seenYoutubeIds.has(t.youtubeId)) {
      const prevTrack = seenYoutubeIds.get(t.youtubeId)!;
      errors.push(
        `Duplicate youtubeId "${t.youtubeId}" on Track ${trackNum} (already used by Track ${prevTrack})`,
      );
    } else {
      seenYoutubeIds.set(t.youtubeId, trackNum);
    }
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    trackCount: tracks?.length ?? 0,
  };
}
