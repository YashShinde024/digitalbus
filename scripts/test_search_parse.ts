import { playlist } from "../src/data/playlist.ts";
import fs from "fs";

async function searchExactYouTube(t: typeof playlist[0]) {
  const query = `${t.title} ${t.album} ${t.artist}`;
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const html = await res.text();
    // Parse videoId and title from initialData JSON in the page
    const matches = Array.from(html.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})","thumbnail":[\s\S]*?"title":\{"runs":\[\{"text":"([^"]+)"\}/g));
    const candidates = matches.map(m => ({
      videoId: m[1],
      videoTitle: m[2]
    }));
    return candidates;
  } catch (err: any) {
    console.error(`Error fetching for ${t.title}:`, err.message);
    return [];
  }
}

async function run() {
  console.log("Searching candidates for first 5 tracks...");
  for (let i = 0; i < 5; i++) {
    const t = playlist[i];
    const cands = await searchExactYouTube(t);
    console.log(`\nTrack ${t.id}: ${t.title} - ${t.artist} (${t.album})`);
    console.log(`Current ID in playlist: ${t.youtubeId}`);
    console.log("Top YouTube Results:");
    cands.slice(0, 3).forEach((c, idx) => {
      console.log(`  ${idx + 1}. [${c.videoId}] "${c.videoTitle}"`);
    });
    await new Promise(r => setTimeout(r, 500));
  }
}

run();
