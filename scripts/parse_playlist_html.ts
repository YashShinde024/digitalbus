import fs from "fs";

const playlistFile = "C:/Users/Yash Shinde/.gemini/antigravity-ide/brain/782695a7-aecb-4697-a727-6a9dde44a035/.system_generated/steps/43/content.md";
const html = fs.readFileSync(playlistFile, "utf8");

// Look for video IDs and titles in the playlist JSON or HTML
// In ytInitialData, playlistVideoRenderer contains videoId and title
const videoMatches = Array.from(html.matchAll(/"playlistVideoRenderer":\s*\{"videoId":"([^"]+)"[\s\S]*?"title":\s*\{"runs":\s*\[\{"text":"([^"]+)"\}/g));

console.log(`Found ${videoMatches.length} playlistVideoRenderer entries!`);

const playlistVideos = [];
for (const m of videoMatches) {
  playlistVideos.push({
    videoId: m[1],
    title: m[2]
  });
}

// Fallback search if regex above is too strict
if (playlistVideos.length === 0) {
  const vIdMatches = Array.from(html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g));
  console.log(`Found ${vIdMatches.length} raw videoId matches`);
}

console.log(JSON.stringify(playlistVideos.slice(0, 30), null, 2));
fs.writeFileSync("scripts/yt_playlist_extracted.json", JSON.stringify(playlistVideos, null, 2));
