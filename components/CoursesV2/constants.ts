import { IndexedCourseItem, ITenantData } from "../../types/courses";

export const GROUPS = [
  "kurs",
  "lag",
  "organisasjoner",
  "fylker",
  "studieplaner",
] as const;
export type GroupType = (typeof GROUPS)[number];

export interface CoursesProps extends ITenantData {
  county: string;
  countyOptions: string[][];
  organization: string;
  organizationOptions: string[][];
  year: string;
  yearOptions: string[];
  group: GroupType;
  tenantName: string;
}

export interface ExtendedICourseItem extends IndexedCourseItem {
  curriculum: string;
  organizer: string;
}
