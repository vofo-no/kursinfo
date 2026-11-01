import { createHmac } from "node:crypto";

const RING_ABOVE = "\u030a"; // the ring that makes å

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD") // á -> a + accent, å -> a + ring; æ and ø don't decompose
    .replace(/[\u0300-\u036f]/g, (mark) => (mark === RING_ABOVE ? mark : ""))
    .normalize("NFC")
    .replace(/[^\p{L}]+/gu, " ") // hyphens, apostrophes, digits, punctuation -> space
    .trim();
}

export function getTeacherKey(
  secret: string,
  name: string,
  ...parts: string[] // yearOfBirth, gender
) {
  const normalizedName = normalizeName(name);
  if (!normalizedName) {
    throw new Error("Cannot build a teacher key without a name");
  }

  const input = JSON.stringify([
    normalizedName,
    ...parts.map((p) => String(p).trim().toLowerCase()),
  ]);
  const hex = createHmac("sha256", secret)
    .update(input)
    .digest("hex")
    .slice(0, 15); // 60 bits
  return BigInt(`0x${hex}`).toString(36).padStart(12, "0");
}
