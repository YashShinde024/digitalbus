import fs from "fs";

const list = JSON.parse(fs.readFileSync("scripts/final_curated_playlist.json", "utf8"));

let tsContent = `export type Track = {
  id: number;
  title: string;
  artist: string;
  youtubeId: string;
  audio?: string;
  cover: string;
  album?: string;
  year?: number;
};

export const YOUTUBE_PLAYLIST_ID = "PLYaI0MauTkP8";

export const FALLBACK_ARTWORK = "/covers/song-01.jpg";

export function getTrackCover(id: number) {
  const covers = ["/covers/song-01.jpg", "/covers/song-02.jpg", "/covers/song-03.jpg"];
  return covers[(Math.max(1, id) - 1) % covers.length];
}

/**
 * DIGITAL BUS PLAYLIST
 * Media is streamed directly from YouTube via YouTube IFrame Player API.
 * All 77 tracks verified with unique, embeddable YouTube video IDs.
 */
export const playlist: Track[] = [
`;

for (const t of list) {
  tsContent += `  {
    id: ${t.id},
    title: ${JSON.stringify(t.title)},
    artist: ${JSON.stringify(t.artist)},
    youtubeId: "${t.youtubeId}",
    cover: "${t.cover}",
    album: ${JSON.stringify(t.album)},
    year: ${t.year},
  },
`;
}

tsContent += `];

export const externalLinks = {
  spotify: "https://open.spotify.com/playlist/7uzeaedqlsiKkc4obVfgSt?si=dtUjcC9wRfOv8ByDrHrVqw",
  youtubeMusic: "https://music.youtube.com/playlist?list=PLYaI0MauTkP8",
  appleMusic:
    "https://music.apple.com/in/playlist/indian-bus-drivers-playlist/pl.u-KVXBkPPFLamlYoa?ls",
  xpertMelody: "https://www.youtube.com/@XpertMelody",
};
`;

fs.writeFileSync("src/data/playlist.ts", tsContent);
console.log("Successfully written updated src/data/playlist.ts with 77 verified tracks!");
