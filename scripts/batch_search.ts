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
    if (!res.ok) {
      console.warn(`[HTTP ${res.status}] for "${query}"`);
      return [];
    }
    const html = await res.text();

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
    console.error(`Error for ${t.id} ("${t.title}"):`, err.message);
    return [];
  }
}

async function processBatch(startIndex: number, endIndex: number) {
  console.log(`Processing tracks ${startIndex + 1} to ${endIndex}...`);
  const results: any[] = [];

  for (let i = startIndex; i < endIndex; i++) {
    const t = playlist[i];
    const cands = await searchTrack(t);
    results.push({
      id: t.id,
      title: t.title,
      artist: t.artist,
      album: t.album,
      year: t.year,
      currentId: t.youtubeId,
      candidates: cands.slice(0, 5),
    });
    console.log(`[${t.id}/77] "${t.title}" (${t.album}) -> ${cands.length > 0 ? `[${cands[0].videoId}] "${cands[0].videoTitle}"` : "NOT FOUND"}`);
    await new Promise((r) => setTimeout(r, 1200));
  }

  return results;
}

async function run() {
  const start = parseInt(process.argv[2] || "0", 10);
  const count = parseInt(process.argv[3] || "15", 10);
  const end = Math.min(start + count, playlist.length);
  const results = await processBatch(start, end);
  fs.writeFileSync(`scripts/candidates_batch_${start}_${end}.json`, JSON.stringify(results, null, 2));
}

run();
