const { titleCase } = require("title-case");

const MISCASED =
  /[\s:–—-](og|i|på|eller|av(:?d\.?(?:eling)?)?)(?:$|[\s:–—-])/gi;

function smartCase(str) {
  if (typeof str !== "string") return undefined;
  if (str !== str.toUpperCase()) return str;

  const cased = titleCase(str.trim().toLowerCase());
  const fixed = cased.replace(MISCASED, (m) => m.toLowerCase());

  return fixed;
}

module.exports = smartCase;
