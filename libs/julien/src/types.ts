import { CourseStatuses } from "./constants";

export enum CourseStatus {
  PLANNED = CourseStatuses.PLANNED,
  DONE = CourseStatuses.DONE,
}

export interface IndexedCourseItem {
  countyIndex: number;
  curriculumIndex: number;
  endDate?: string;
  endYear?: string;
  facilitationGrant?: number;
  grant?: number;
  hasTeacher?: boolean;
  hours: number;
  ID: string;
  locationCode: string;
  organizationCode: string;
  organizerIndex: number;
  participants?: number;
  startDate: string;
  status: CourseStatus;
  title: string;
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
  reportSchema?: string;
  useTitleColumn?: boolean;
  showFacilitationGrants?: boolean;
  showGrantsSpecifications?: boolean;
}

export interface Course {
  curriculumCode?: string;
  curriculumId: string;
  curriculumTitle: string;
  endDate?: string;
  extraGrant?: number;
  facilitationGrant?: number;
  grant?: number;
  hasTeacher?: boolean;
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
export interface Adapter {
  toString: () => string;
  get: (tenantId: string, year: string) => Promise<Course[]>;
}
