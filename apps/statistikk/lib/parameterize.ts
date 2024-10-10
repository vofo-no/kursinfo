const PATH_REGEX = /[^a-z0-9æøå\s-]/g;

export default function parameterize(str: unknown) {
  return String(str)
    .toLowerCase()
    .replace(PATH_REGEX, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[æå]/g, "a")
    .replace(/ø/g, "o");
}
