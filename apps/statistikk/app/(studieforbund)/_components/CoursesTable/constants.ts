import { IndexedCourseItem } from "@vofo-no/kursinfo-lite";

export type GroupType =
  | "kurs"
  | "lag"
  | "organisasjoner"
  | "fylker"
  | "studieplaner";

export interface ExtendedICourseItem extends IndexedCourseItem {
  curriculum: string;
  organizer: string;
}
