import eapply from "@kursinfo/eapply-sdk";

import { CourseStatuses } from "../constants";
import { Adapter, Course } from "../types";

export class EapplyAdapter implements Adapter {
  toString() {
    return "Eapply";
  }

  async get(tenantId: string, year: string) {
    const client = eapply(tenantId);

    return client.getAllCoursesInYear(year).then((data) =>
      data
        .filter((item) => item.hours)
        .filter(
          (item) =>
            item.applicationStatus === "Granted" ||
            (item.applicationStatus === "Closed" && item.amountApproved),
        )
        .filter((item) => item.decision !== "Rejected")
        .map((i) => {
          const course: Course = {
            curriculumCode: i.coursePlanCode,
            curriculumId: i.coursePlanId,
            curriculumTitle: i.coursePlanTitle || "",
            endDate: i.endDate,
            extraGrant: i.extraGrant,
            facilitationGrant: i.facilitationGrant,
            grant: typeof i.totalGrant === "number" ? i.totalGrant : undefined,
            hasTeacher: !!i.hoursWithTeacher,
            hours: i.hours || 0,
            ID: i.caseNumber,
            locationCode: i.locationCode || "0000",
            organizationCode: i.memberOrganizationCode || "000",
            organizationName:
              (i.memberOrganizationCode || "000") !== "000"
                ? i.memberOrganizationName || ""
                : i.tenantName,
            organizerId: i.applicantOrganizationId,
            organizerName: i.applicantName,
            participants: i.validParticipantsTotal,
            participantsAll: i.participantsTotal,
            startDate: i.startDate || "",
            status:
              (i.amountApproved || 0) > 0
                ? CourseStatuses.DONE
                : CourseStatuses.PLANNED,
            title: i.courseTitle,
          };
          return course;
        }),
    );
  }
}
