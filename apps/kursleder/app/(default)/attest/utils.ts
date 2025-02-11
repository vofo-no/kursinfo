import fs from "fs";
import path from "path";

function getMDXFiles(dir: fs.PathLike) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export function getAttestSlugs(version: string) {
  return getMDXFiles(path.join(process.cwd(), "content", "attest", version))
    .map((file) => path.basename(file, path.extname(file)))
    .filter((name) => name !== "index")
    .sort();
}

export function getAttestVersions() {
  return fs
    .readdirSync(path.join(process.cwd(), "content", "attest"), {
      withFileTypes: true,
    })
    .filter((entry) => entry.isDirectory() && entry.name.startsWith("v"))
    .map((entry) => path.basename(entry.name))
    .sort();
}
