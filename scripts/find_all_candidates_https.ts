import { playlist } from "../src/data/playlist.ts";
import fs from "fs";
import https from "https";

function cleanTitle(title: string) {
  return title
    .replace(/\(From[^\)]+\)/gi, "")
    .replace(/- Female Version/gi, "Female")
    .replace(/- Male Version/gi, "Male")
    .replace(/- From[^\-]+$/gi, "")
    .replace(/- Kumar Sanu Version/gi, "")
    .trim();
}

function fetchYoutubePage(query: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", (err) => reject(err));
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Timeout"));
    });
  });
}

async function searchTrack(t: typeof playlist[0], retryCount = 0): Promise<any[]> {
  const cleaned = cleanTitle(t.title);
  const mainArtist = t.artist.split(",")[0].trim();
  const query = `${cleaned} ${t.album} ${mainArtist}`;

  try {
    const html = await fetchYoutubePage(query);
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

    if (candidates.length === 0 && retryCount < 2) {
      await new Promise((r) => setTimeout(r, 1000));
      return searchTrack(t, retryCount + 1);
    }

    return candidates;
  } catch (err: any) {
    if (retryCount < 3) {
      await new Promise((r) => setTimeout(r, 1500));
      return searchTrack(t, retryCount + 1);
    }
    console.error(`Error searching track ${t.id} ("${t.title}"):`, err.message);
    return [];
  }
}

async function run() {
  console.log(`Starting reliable candidate search for all ${playlist.length} tracks...`);
  const mappingResults: any[] = [];

  for (let i = 0; i < playlist.length; i++) {
    const t = playlist[i];
    const candidates = await searchTrack(t);
    const topCandidates = candidates.slice(0, 6);

    mappingResults.push({
      id: t.id,
      title: t.title,
      artist: t.artist,
      album: t.album,
      year: t.year,
      currentYoutubeId: t.youtubeId,
      candidates: topCandidates,
    });

    console.log(
      `[${t.id}/${playlist.length}] "${t.title}" (${t.album}) -> ${topCandidates.length > 0 ? `Found ${candidates.length} (Top: [${topCandidates[0]?.videoId}] "${topCandidates[0]?.videoTitle}")` : "NO CANDIDATES"}`
    );

    // Moderate pacing to avoid rate limiting
    await new Promise((r) => setTimeout(r, 400));
  }

  fs.writeFileSync("scripts/youtube_candidates.json", JSON.stringify(mappingResults, null, 2));
  console.log("\nFinished fetching all candidates! Saved to scripts/youtube_candidates.json");
}

run();
