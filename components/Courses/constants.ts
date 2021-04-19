import React from "react";

import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "../../lib/constants";
import { IndexedCourseItem, ITenantData } from "../../types/courses";

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
