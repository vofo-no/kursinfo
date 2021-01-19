function smartCase(str) {
  if (typeof str !== "string") return undefined;
  if (str !== str.toUpperCase()) return str;

  const trimmed = str.trim().toLowerCase();

  return `${trimmed[0].toUpperCase()}${trimmed.substring(1)}`.replace(
    /\sas$/,
    " AS"
  );
}

module.exports = smartCase;
