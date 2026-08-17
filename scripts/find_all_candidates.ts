import { playlist } from "../src/data/playlist.ts";
import fs from "fs";

function cleanTitle(title: string) {
  return title
    .replace(/\(From[^\)]+\)/gi, "")
    .replace(/- Female Version/gi, "Female")
    .replace(/- Male Version/gi, "Male")
    .replace(/- From[^\-]+$/gi, "")
    .replace(/- Kumar Sanu Version/gi, "")
    .trim();
}

async function searchTrack(t: typeof playlist[0]) {
  const cleaned = cleanTitle(t.title);
  // Main artists
  const mainArtist = t.artist.split(",")[0].trim();
  const query = `${cleaned} ${t.album} ${mainArtist}`;
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

    // Match videoId and video title
    const matches = Array.from(
      html.matchAll(
        /"videoId":"([a-zA-Z0-9_-]{11})","thumbnail":[\s\S]*?"title":\{"runs":\[\{"text":"([^"]+)"\}/g
      )
    );

    const candidates = [];
    const seen = new Set<string>();

    for (const m of matches) {
      const vId = m[1];
      const vTitle = m[2];
      if (!seen.has(vId)) {
        seen.add(vId);
        candidates.push({
          videoId: vId,
          videoTitle: vTitle,
        });
      }
    }

    return candidates;
  } catch (err: any) {
    console.error(`Error searching for ${t.id} - ${t.title}:`, err.message);
    return [];
  }
}

async function run() {
  console.log(`Auditing and finding candidate YouTube videos for all ${playlist.length} tracks...`);
  const mappingResults: any[] = [];

  for (let i = 0; i < playlist.length; i++) {
    const t = playlist[i];
    const candidates = await searchTrack(t);
    const topCandidates = candidates.slice(0, 5);

    mappingResults.push({
      id: t.id,
      title: t.title,
      artist: t.artist,
      album: t.album,
      year: t.year,
      currentYoutubeId: t.youtubeId,
      candidates: topCandidates,
    });

    console.log(`[${t.id}/${playlist.length}] "${t.title}" (${t.album}) -> Found ${candidates.length} candidates. Top: [${topCandidates[0]?.videoId}] "${topCandidates[0]?.videoTitle}"`);

    await new Promise((r) => setTimeout(r, 200));
  }

  fs.writeFileSync("scripts/youtube_candidates.json", JSON.stringify(mappingResults, null, 2));
  console.log("\nFinished fetching candidates! Saved to scripts/youtube_candidates.json");
}

run();
