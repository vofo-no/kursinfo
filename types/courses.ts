import { CourseStatuses } from "julien/constants";
import { ParsedUrlQuery } from "querystring";

import { GroupType } from "../components/CoursesV2/constants";

export interface Course {
  curriculumCode?: string;
  curriculumId: string;
  curriculumTitle: string;
  endDate?: string;
  endYear?: string;
  extraGrant?: number;
  facilitationGrant?: number;
  grant?: number;
  hours: number;
  ID: string;
  locationCode: string;
  organizationCode: string;
  organizationName: string;
  organizerId: string;
  organizerName: string;
  participants?: number;
  participantsAll?: number;
  startDate: string;
  status: CourseStatus;
  title: string;
}

export interface IndexedCourseItem {
  countyIndex: number;
  curriculumIndex: number;
  endDate?: string;
  endYear?: string;
  facilitationGrant?: number;
  grant?: number;
  hours: number;
  ID: string;
  locationCode: string;
  organizationCode: string;
  organizerIndex: number;
  participants?: number;
  reportSchema: boolean;
  startDate: string;
  status: CourseStatus;
  title: string;
}

export enum CourseStatus {
  PLANNED = CourseStatuses.PLANNED,
  DONE = CourseStatuses.DONE,
}

export interface Adapter {
  get(tenantId: string, year: string): Promise<Array<Course>>;
}

export interface CoursesParams extends ParsedUrlQuery {
  year: string;
  county: string;
  organization: string;
  group: GroupType;
}

export interface ITenantData {
  buildTime: string;
  counties: Array<string>;
  countyParams: Array<string>;
  curriculums: Array<string>;
  items: Array<IndexedCourseItem>;
  organizationParams: Array<string>;
  organizations: Array<string>;
  organizers: Array<string>;
  reportSchema: string;
  useTitleColumn?: boolean;
}
