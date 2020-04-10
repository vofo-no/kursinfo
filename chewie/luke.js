const PATH_REGEX = /[^a-z0-9æøå\s\-]/g;

function parameterize(str) {
  return str
    .toLowerCase()
    .replace(PATH_REGEX, "")
    .replace(/\s+/g, "-")
    .replace(/\-+/g, "-");
}

module.exports = { parameterize };
