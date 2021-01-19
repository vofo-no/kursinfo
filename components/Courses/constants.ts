export const ALL_COUNTIES_OPTION = ["hele-landet", "Hele landet"];
export const GROUPS = [
  "kurs",
  "lag",
  "organisasjoner",
  "fylker",
  "studieplaner",
] as const;
export type GroupType = typeof GROUPS[number];
