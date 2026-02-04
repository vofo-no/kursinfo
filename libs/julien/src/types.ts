import { CourseStatus } from "@kursinfo/types";

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
