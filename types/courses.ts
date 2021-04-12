import { ParsedUrlQuery } from "node:querystring";

import { GroupType } from "../components/Courses/constants";

export interface CoursesParams extends ParsedUrlQuery {
  year: string;
  county: string;
  organization: string;
  group: GroupType;
}

export interface ICourseItem {
  caseNumber: string;
  countyIndex: number;
  curriculumIndex: number;
  coursePlanId: string;
  courseStatus: string;
  courseTitle: string;
  endDate: string;
  hours: number;
  locationCode: string;
  organizationId: string;
  organizationIndex: number;
  organizerIndex: number;
  participantCountTotal: number;
  participants?: number;
  planned: boolean;
  reportSchema: boolean;
  reportStatus: string;
  startDate: string;
  totalGrantActual?: number;
}

export interface ITenantData {
  counties: Array<string>;
  countyParams: Array<string>;
  curriculums: Array<string>;
  items: Array<ICourseItem>;
  organizationParams: Array<string>;
  organizers: Array<string>;
  reportSchema: string;
}
