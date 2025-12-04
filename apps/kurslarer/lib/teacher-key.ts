import { createHash } from "crypto";
import { metaphone } from "metaphone";

// Deliberately simple hash to avoid PII storage
function createShortHash(data: string[]) {
  return createHash("shake256", { outputLength: 3 })
    .update(data.join("."))
    .digest("base64url");
}

export function getTeacherKey(
  firstName: string,
  lastName: string,
  ...parts: string[]
) {
  return [metaphone(firstName), metaphone(lastName), createShortHash(parts)]
    .join("-")
    .toLowerCase();
}
