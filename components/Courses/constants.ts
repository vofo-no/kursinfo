import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "../../lib/constants";

export const ALL_COUNTIES_OPTION = [DEFAULT_COUNTY_PARAM, "Hele landet"];
export const ALL_ORGANIZATIONS_OPTION = [
  DEFAULT_ORGANIZATION_PARAM,
  "Alle organisasjoner",
];
export const GROUPS = [
  "kurs",
  "lag",
  "organisasjoner",
  "fylker",
  "studieplaner",
] as const;
export type GroupType = typeof GROUPS[number];

export function isDefaultCounty(val: string) {
  return val === DEFAULT_COUNTY_PARAM;
}

export function isDefaultOrganization(val: string) {
  return val === DEFAULT_ORGANIZATION_PARAM;
}

export interface ICoursesBaseProps {
  county: string;
  countyOptions: string[][];
  organization: string;
  organizationOptions: string[][];
  year: string;
  yearOptions: string[];
}

export interface CoursesParams {
  year?: string;
  county?: string;
  organization?: string;
  group?: GroupType;
}

export interface IAggregatedData {
  id: string;
  name: string;
  plannedCourses?: number;
  plannedHours?: number;
  courses: number;
  hours: number;
  participants: number;
  grant: number;
}
