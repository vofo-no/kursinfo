/**
 * Script for compressing and uploading files to statistics blob storage.
 * Usage: (from project root cwd)
 *   $ npx tsx --env-file=apps/statistikk/.env libs/julien/src/upload-file.ts 2504 2021
 */

import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { compress } from "compress-json";

const [sf, year] = process.argv.slice(2);

console.log(`sf: ${sf}`);
console.log(`year: ${year}`);

// Open data file
const dataPath = path.join(
  process.cwd(),
  `apps/statistikk/data/${sf}/${year}.json`,
);
const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

if (data) {
  // Upload compressed file
  const outpath = `sf-data/v1/${sf}/${year}.json`;
  put(outpath, JSON.stringify(compress(data)), {
    access: "public",
    addRandomSuffix: false,
  }).then((result) => console.log(`Uploaded: ${result.url}`));
} else {
  console.error("No data");
}
