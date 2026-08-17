import fs from "fs";

const allData = JSON.parse(fs.readFileSync("scripts/all_extracted_candidates.json", "utf8"));

console.log("=== CANDIDATE AUDIT REPORT ===");
const idToTracks = new Map<string, number[]>();
const trackMapping: any[] = [];

for (let id = 1; id <= 77; id++) {
  const item = allData[id];
  if (!item) {
    console.error(`Track ${id} missing from batch extraction!`);
    continue;
  }

  const topCand = item.candidates?.[0];
  const chosenId = topCand?.videoId || "MISSING";
  const chosenTitle = topCand?.videoTitle || "NONE";

  if (!idToTracks.has(chosenId)) {
    idToTracks.set(chosenId, [id]);
  } else {
    idToTracks.get(chosenId)!.push(id);
  }

  trackMapping.push({
    id,
    title: item.title,
    artist: item.artist,
    album: item.album,
    year: item.year,
    cover: item.cover,
    oldId: item.currentId,
    chosenId,
    chosenTitle,
    allCandidates: item.candidates,
  });
}

console.log(`\nDuplicate top candidates across 77 tracks:`);
let dupCount = 0;
for (const [vId, trackIds] of idToTracks.entries()) {
  if (trackIds.length > 1) {
    dupCount++;
    console.log(`  YouTube ID "${vId}" matched by tracks: ${trackIds.join(", ")}`);
    trackIds.forEach(tid => {
      const tm = trackMapping[tid - 1];
      console.log(`    Track ${tid}: "${tm.title}" (${tm.album})`);
    });
  }
}

console.log(`\nTotal duplicate candidate collisions: ${dupCount}`);
fs.writeFileSync("scripts/audited_mapping_raw.json", JSON.stringify(trackMapping, null, 2));
