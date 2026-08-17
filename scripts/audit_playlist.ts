import { playlist } from "../src/data/playlist.ts";

console.log("=== DIGITAL BUS PLAYLIST AUDIT ===");
console.log(`Total tracks in playlist.ts: ${playlist.length}`);

const badPatternTracks = [];
const duplicateTracks = [];
const idMap = new Map();

for (const t of playlist) {
  if (!t.youtubeId || t.youtubeId.length !== 11) {
    badPatternTracks.push({ ...t, reason: "length != 11" });
  } else if (/^[a-z]+$/.test(t.youtubeId) || t.youtubeId.includes("abcdef") || t.youtubeId.includes("1z9b2w")) {
    badPatternTracks.push({ ...t, reason: "sequential / fake pattern" });
  }

  if (!idMap.has(t.youtubeId)) {
    idMap.set(t.youtubeId, [t]);
  } else {
    idMap.get(t.youtubeId).push(t);
  }
}

console.log(`\nPotential fake/invalid pattern tracks (${badPatternTracks.length}):`);
badPatternTracks.forEach((t) => {
  console.log(`  Track ${t.id}: "${t.title}" - ${t.artist} [${t.album}] => ${t.youtubeId} (${t.reason})`);
});

console.log(`\nDuplicate YouTube IDs:`);
for (const [ytId, tracks] of idMap.entries()) {
  if (tracks.length > 1) {
    console.log(`  ID: ${ytId} used by ${tracks.length} tracks:`);
    tracks.forEach((t) => console.log(`    - Track ${t.id}: "${t.title}" - ${t.artist} [${t.album}]`));
  }
}
