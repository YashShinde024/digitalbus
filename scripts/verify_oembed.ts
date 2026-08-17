import { playlist } from "../src/data/playlist.ts";

async function fetchOEmbed(videoId: string) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { ok: false, status: res.status, title: null, author: null };
    }
    const data = await res.json();
    return { ok: true, status: 200, title: data.title, author: data.author_name };
  } catch (err: any) {
    return { ok: false, status: 0, title: null, author: null, error: err.message };
  }
}

async function run() {
  console.log("Checking all 77 playlist tracks with YouTube oEmbed endpoint...");
  const results: any[] = [];

  for (let i = 0; i < playlist.length; i++) {
    const t = playlist[i];
    const info = await fetchOEmbed(t.youtubeId);
    results.push({
      id: t.id,
      trackTitle: t.title,
      artist: t.artist,
      album: t.album,
      youtubeId: t.youtubeId,
      ...info,
    });
    console.log(`[${t.id}/77] ${t.title} (${t.youtubeId}) -> ${info.ok ? `OK: "${info.title}"` : `FAILED (${info.status})`}`);
    // Small delay
    await new Promise((r) => setTimeout(r, 60));
  }

  const valid = results.filter((r) => r.ok);
  const invalid = results.filter((r) => !r.ok);
  console.log(`\nSummary: ${valid.length} valid embeddable videos, ${invalid.length} failed/invalid.`);
}

run();
