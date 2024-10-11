export interface EapplyCourse {
  amountApplied?: number;
  amountApproved?: number;
  amountGranted?: number;
  amountPaid?: number;
  applicantName: string;
  applicantOrganizationId: string;
  applicationStatus: EapplyApplicationStatus;
  applyFacilitationGrant?: boolean;
  caseId: string;
  caseNumber: string;
  coursePlanCode?: string;
  coursePlanId: string;
  coursePlanTitle?: string;
  courseStatus?: EapplyCourseStatus;
  courseTitle: string;
  decided?: string;
  decision?: EapplyApplicationStatus;
  endDate?: string;
  endSemester?: EapplyEndSemester;
  endYear?: number;
  extraGrant?: number;
  facilitationGrant?: number;
  facilitationGrantParticipantsFemale?: number;
  facilitationGrantParticipantsMale?: number;
  facilitationGrantParticipantsTotal?: number;
  hourGrant?: number;
  hours?: number;
  hoursWithoutTeacher?: number;
  hoursWithTeacher?: number;
  id: string;
  locationCode?: string;
  locationName?: string;
  memberOrganizationCode?: string;
  memberOrganizationId?: string;
  memberOrganizationName?: string;
  participantsFemale?: number;
  participantsMale?: number;
  participantsTotal?: number;
  repertoire?: string;
  startDate?: string;
  startYear?: number;
  submitted: string;
  teacher?: string;
  tenantId: string;
  tenantName: string;
  totalGrant?: number;
  validParticipantsFemale?: number;
  validParticipantsMale?: number;
  validParticipantsTotal?: number;
}

export interface EapplyDocument {
  id: string;
  caseId: string;
  caseNumber: string;
  formType?: string;
  documentNumber: number;
  revisionNumber: number;
  status: string;
  created: string;
  title?: string;
  participants: [
    {
      role: string;
      roleCode: string;
      sortOrder: number;
      name: string;
      city?: string;
      zip?: string;
      phoneNumber?: string;
      emailAddress?: string;
      gender?: "Female" | "Male";
      yearOfBirth?: number;
    },
  ];
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
  Planned = "Planned",
  Started = "Started",
}

export enum EapplyEndSemester {
  Fall = "Fall",
  Spring = "Spring",
}
