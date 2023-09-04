import { IndexedCourseItem, ITenantData } from "types/courses";

export const GROUPS = [
  "kurs",
  "lag",
  "organisasjoner",
  "fylker",
  "studieplaner",
] as const;
export type GroupType = (typeof GROUPS)[number];

export interface ExtendedICourseItem extends IndexedCourseItem {
  curriculum: string;
  organizer: string;
}
