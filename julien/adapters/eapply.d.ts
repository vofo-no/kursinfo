import Adapter from "./index";

export interface EapplyCourse {
  applicantName: string;
  applicantOrganizationId: string;
  applicationStatus: EapplyApplicationStatus;
  applyFacilitationGrant?: boolean;
  caseId: string;
  caseNumber: string;
  coursePlanCode: string;
  coursePlanId: string;
  coursePlanTitle: string;
  courseStatus?: EapplyCourseStatus;
  courseTitle: string;
  decided?: string;
  decision?: EapplyApplicationStatus;
  endDate: string;
  endSemester?: EapplyEndSemester;
  endYear?: number;
  extraGrantActual?: number;
  extraGrantApplied?: number;
  extraGrantGranted?: number;
  facilitationGrantActual?: number;
  facilitationGrantApplied?: number;
  facilitationGrantGranted?: number;
  hourGrantActual?: number;
  hourGrantApplied?: number;
  hourGrantGranted?: number;
  hours?: number;
  hoursWithoutTeacher?: number;
  hoursWithTeacher?: number;
  id: string;
  locationCode?: string;
  locationName?: string;
  memberOrganizationCode?: string;
  memberOrganizationId?: string;
  memberOrganizationName?: string;
  participantCountFemale?: number;
  participantCountMale?: number;
  participantCountTotal?: number;
  repertoire?: string;
  reportStatus?: EapplyReportStatus;
  startDate: string;
  startYear?: number;
  submitted: string;
  teacher?: string;
  tenantId: string;
  tenantName: string;
  totalGrantActual?: number;
  totalGrantApplied?: number;
  totalGrantGranted?: number;
}

export enum EapplyApplicationStatus {
  Draft = "Draft",
  New = "New",
  Open = "Open",
  Reopened = "Reopened",
  Granted = "Granted",
  Rejected = "Rejected",
  Dismissed = "Dismissed",
  Closed = "Closed",
  Cancelled = "Cancelled",
  Deleted = "Deleted",
}

export enum EapplyCourseStatus {
  Completed = "Completed",
  Started = "Started",
}

export enum EapplyEndSemester {
  Fall = "Fall",
  Spring = "Spring",
}

export enum EapplyReportStatus {
  Approved = "Approved",
  Rejected = "Rejected",
}

export class EapplyAdapter extends Adapter {}
