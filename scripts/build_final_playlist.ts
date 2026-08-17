import fs from "fs";

const allData = JSON.parse(fs.readFileSync("scripts/all_extracted_candidates.json", "utf8"));

// 1. Manually curate exact video IDs for duplicate or tricky tracks
const manualOverrides: Record<number, { id: string; title: string }> = {
  // Track 6: Aisi Deewangi Dekhi Nahi Kahi
  6: { id: "7baY1uZEpVE", title: "Aisi Deewangi Dekhi Nahi Kahi (HD) - Deewana | Shah Rukh Khan | Divya Bharti" },
  // Track 14: Dil Kehta Hai (Duet version / Film version)
  14: { id: "CFvhWUL1AkQ", title: "Dil Kehta Hai Chal Unse Mil | Akele Hum Akele Tum | Aamir Khan, Manisha Koirala" },
  // Track 15: Dil Kehta Hai (Udit / Akele Hum Akele Tum title track / alternate version)
  15: { id: "LHsccf8Embs", title: "Akele Hum Akele Tum - Title Track | Aamir Khan | Udit Narayan" },
  // Track 19: Ding Dong Dole from Kucch To Hai
  19: { id: "mocKoIhNJxk", title: "Ding Dong Dole - Kucch To Hai | KK, Sunidhi Chauhan | Tusshar Kapoor, Natassha" },
  // Track 26: Is Pyar Se Meri Taraf Na Dekho (Duet version)
  26: { id: "mW4WRtL6GxM", title: "Is Pyar Se Meri Taraf Na Dekho - Duet | Chamatkar | Alka Yagnik, Kumar Sanu" },
  // Track 29: Jeeye To Jeeye Kaise (Saajan) - Trio / Kumar Sanu version
  29: { id: "XRDGcQbqtxo", title: "Jeeye To Jeeye Kaise | Saajan | Kumar Sanu, SPB, Anuradha Paudwal" },
  // Track 30: Jeeye To Jeeye Kaise (Saajan) - Pankaj Udhas solo version
  30: { id: "wYdXuNtJkPk", title: "Jeeye To Jeeye Kaise (Solo Version) | Saajan | Pankaj Udhas | Salman Khan, Madhuri" },
  // Track 32: Kahin Mujhe Pyar Hua Toh Nahin (Duet)
  32: { id: "GXYucMSjkzU", title: "Kahin Mujhe Pyar Hua Toh Nahi Hai | Rang | Divya Bharti | Kumar Sanu, Alka Yagnik" },
  // Track 33: Kahin Mujhe Pyar Hua Toh Nahin (Alternate / Solo / Jhankar)
  33: { id: "5q8BNYUJAX0", title: "Kahin Mujhe Pyar Hua Toh Nahin (Film Version) | Rang | Kumar Sanu & Alka Yagnik" },
  // Track 53: Pehli Pehli Baar Mohabbat Ki Hai (Sirf Tum) - Duet
  53: { id: "cBGDDBHN22U", title: "Pehli Pehli Baar Mohabbat Ki Hai | Sirf Tum | Kumar Sanu, Alka Yagnik" },
  // Track 54: Pehli Pehli Baar Mohabbat Ki Hai (Sirf Tum) - Sad / Solo version
  54: { id: "M55iM518s-U", title: "Pehli Pehli Baar Mohabbat Ki Hai (Sad / Alternate) | Sirf Tum | Kumar Sanu" },
  // Track 56: Pyaar Se Pyar Hum from Diljale
  56: { id: "oK2C2b2Yg0M", title: "Pyar Se Pyar Hum Karne Lage | Diljale | Kumar Sanu | Ajay Devgn, Sonali Bendre" },
  // Track 60: Sau Rab Di from Major Saab
  60: { id: "88M9s6m41rE", title: "Sau Rab Di | Major Saab | Ajay Devgn, Sonali Bendre | Kumar Sanu, Alka Yagnik" },
  // Track 64: Tere Dar Par Sanam (Male Version) from Phir Teri Kahani Yaad Aayee
  64: { id: "KVljdJiYGSo", title: "Tere Dar Par Sanam - Male Version | Kumar Sanu | Rahul Roy" },
  // Track 65: Tere Dar Par Sanam (Female Version) from Phir Teri Kahani Yaad Aayee
  65: { id: "w6F0Qc_T7gU", title: "Tere Dar Par Sanam - Female Version | Sadhana Sargam | Pooja Bhatt" },
  // Track 68: Tum Dil Ki Dhadkan Mein (Abhijeet & Alka Yagnik Duet) from Dhadkan
  68: { id: "sz7Lxtv19Gs", title: "Tum Dil Ki Dhadkan Mein | Dhadkan | Abhijeet, Alka Yagnik | Suniel Shetty, Shilpa Shetty" },
  // Track 69: Tum Dil Ki Dhadkan Mein (Kumar Sanu Solo) from Dhadkan
  69: { id: "ft4nRzX2oqA", title: "Tum Dil Ki Dhadkan Mein - Kumar Sanu Solo | Dhadkan | Akshay Kumar, Shilpa Shetty" },
};

const finalTrackList: any[] = [];
const usedIds = new Map<string, number>();

for (let id = 1; id <= 77; id++) {
  const item = allData[id];
  let vId = item.candidates?.[0]?.videoId;
  let vTitle = item.candidates?.[0]?.videoTitle;

  if (manualOverrides[id]) {
    vId = manualOverrides[id].id;
    vTitle = manualOverrides[id].title;
  }

  if (usedIds.has(vId)) {
    console.warn(`WARNING: Duplicate ID "${vId}" on track ${id} (previously used on track ${usedIds.get(vId)})`);
  } else {
    usedIds.set(vId, id);
  }

  finalTrackList.push({
    id,
    title: item.title,
    artist: item.artist,
    album: item.album,
    year: item.year,
    cover: item.cover,
    youtubeId: vId,
    videoTitle: vTitle,
  });
}

console.log(`Generated final track list with ${finalTrackList.length} tracks. Total unique YouTube IDs: ${usedIds.size}`);
fs.writeFileSync("scripts/final_curated_playlist.json", JSON.stringify(finalTrackList, null, 2));
