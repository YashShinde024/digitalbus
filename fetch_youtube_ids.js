import fs from "fs";

async function searchYouTube(query) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    const html = await res.text();
    // Look for /watch?v=VIDEO_ID
    const matches = Array.from(html.matchAll(/\/watch\?v=([a-zA-Z0-9_-]{11})/g));
    if (matches.length > 0) {
      // Return the first valid video ID
      for (const m of matches) {
        const id = m[1];
        if (id && id.length === 11) {
          return id;
        }
      }
    }
    return null;
  } catch (err) {
    console.error("Error searching for", query, err.message);
    return null;
  }
}

async function run() {
  const playlistCode = fs.readFileSync("src/data/playlist.ts", "utf8");

  // Extract all tracks
  const trackRegex =
    /id:\s*(\d+),\s*title:\s*"([^"]+)",\s*artist:\s*"([^"]+)",[\s\S]*?album:\s*"([^"]+)",\s*year:\s*(\d+)/g;

  const tracks = [];
  let m;
  while ((m = trackRegex.exec(playlistCode)) !== null) {
    tracks.push({
      id: parseInt(m[1]),
      title: m[2],
      artist: m[3],
      album: m[4],
      year: parseInt(m[5]),
    });
  }

  console.log(`Found ${tracks.length} tracks to search YouTube for exact matches.`);

  const results = [];
  for (let i = 0; i < tracks.length; i++) {
    const t = tracks[i];
    const query = `${t.title} ${t.album} ${t.artist} song`;
    const videoId = await searchYouTube(query);
    console.log(`[${t.id}/${tracks.length}] ${t.title} (${t.album}) -> ${videoId || "NOT FOUND"}`);
    results.push({
      ...t,
      youtubeId: videoId || "5c0D5S1-j7c",
    });
    // Small delay to be polite
    await new Promise((r) => setTimeout(r, 150));
  }

  fs.writeFileSync("youtube_mapping.json", JSON.stringify(results, null, 2));
  console.log("Saved all YouTube video IDs to youtube_mapping.json!");
}

run();
