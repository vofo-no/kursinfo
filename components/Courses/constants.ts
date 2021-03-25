import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "../../lib/constants";
import { ICourseItem } from "../../types/courses";

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

export function isDefaultCounty(val: string): boolean {
  return val === DEFAULT_COUNTY_PARAM;
}

export function isDefaultOrganization(val: string): boolean {
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

export interface CoursesProps extends ICoursesBaseProps {
  group: GroupType;
  counties: Array<string>;
  curriculums: Array<string>;
  organizers: Array<string>;
  items: Array<ICourseItem>;
  reportSchema?: string;
  tabular?: Array<IAggregatedData>;
}

export interface ExtendedICourseItem extends ICourseItem {
  curriculum: string;
  organizer: string;
}
