import { playlist } from "../src/data/playlist.ts";
import fs from "fs";

// List of all tracks
const tracksToSearch = playlist.map(t => ({
  id: t.id,
  title: t.title,
  artist: t.artist,
  album: t.album,
  year: t.year,
  cover: t.cover,
  currentId: t.youtubeId
}));

console.log(`Total tracks: ${tracksToSearch.length}`);
fs.writeFileSync("scripts/tracks_manifest.json", JSON.stringify(tracksToSearch, null, 2));
