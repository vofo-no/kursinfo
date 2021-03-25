const PATH_REGEX = /[^a-z0-9æøå\s-]/g;

function parameterize(str: unknown): string {
  return String(str)
    .toLowerCase()
    .replace(PATH_REGEX, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[æå]/g, "a")
    .replace(/ø/g, "o");
}

export default parameterize;
