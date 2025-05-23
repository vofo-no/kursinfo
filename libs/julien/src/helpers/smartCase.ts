const TOKENS = /[^\s:–—-]+|./g;
const DOWNCASE =
  /^(?:avd?\.?|avdeling|eller|for|fra|i|med|o[fgmn]|på|til|ved)$/i;
const UPCASE = /\b(?:AS|FFO|HLF|LHL)\b/i;
const ALPHANUMERIC_PATTERN = /[A-Za-z0-9\u00C0-\u00FF]/;

export function smartCase(str: unknown) {
  if (typeof str !== "string") return "";

  // Temp fix for NK distriktsledd
  if (str === "NK distriktsledd") return "Norges Korforbund";

  if (str !== str.toUpperCase()) return str;

  let result = "";
  let match: RegExpExecArray | null;

  const input = str.trim().toLowerCase();

  while ((match = TOKENS.exec(input)) !== null) {
    const { 0: token, index } = match;

    if (UPCASE.test(token)) {
      result += token.toUpperCase();
      continue;
    }

    if (!DOWNCASE.test(token) || index === 0) {
      result += token.replace(ALPHANUMERIC_PATTERN, (m) => m.toUpperCase());
      continue;
    }

    result += token;
  }

  return result;
}
