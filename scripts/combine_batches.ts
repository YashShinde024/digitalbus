import fs from "fs";

const files = [
  "scripts/candidates_batch_0_10.json",
  "scripts/candidates_batch_10_30.json",
  "scripts/candidates_batch_30_45.json",
  "scripts/candidates_batch_45_61.json",
  "scripts/candidates_batch_60_77.json",
];

const allData: Record<number, any> = {};

for (const f of files) {
  if (fs.existsSync(f)) {
    const list = JSON.parse(fs.readFileSync(f, "utf8"));
    for (const item of list) {
      allData[item.id] = item;
    }
  }
}

console.log(`Loaded ${Object.keys(allData).length} unique tracks from batches.`);
fs.writeFileSync("scripts/all_extracted_candidates.json", JSON.stringify(allData, null, 2));
