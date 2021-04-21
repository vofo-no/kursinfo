const fetch = require("node-fetch").default;
const CourseStatuses = require("../constants").CourseStatuses;
const Adapter = require("./");

class EapplyAdapter extends Adapter {
  /**
   *
   * @private
   * @param {string} tenantId
   * @param {string} year
   * @returns {Promise<Array<import("./eapply").EapplyCourse>>}
   */
  async fetch(tenantId, year) {
    const credentials = [process.env.EAPPLY_USER, process.env.EAPPLY_TOKEN];
    const headers = {
      Authorization: `Basic ${Buffer.from(credentials.join(":")).toString(
        "base64"
      )}`,
      "Content-Type": "application/json",
    };
    const options = {
      method: "GET",
      headers,
    };

    const url = `${process.env.EAPPLY_URL}/api/v1/courses?limit=99999&tenantId=${tenantId}&endDateFrom=01.01.${year}&endDateTo=31.12.${year}`;

    return fetch(url, options)
      .then(checkStatus)
      .then((response) => response.json())
      .then((data) => data);
  }

  /**
   *
   * @param {string} tenantId
   * @param {string} year
   * @returns {Promise<Array<import("../../types/courses").Course>>}
   */
  async get(tenantId, year) {
    return this.fetch(tenantId, year).then((data) =>
      data
        .filter((item) => item.hours)
        .filter(
          (item) =>
            item.applicationStatus === "Granted" ||
            item.applicationStatus === "Closed"
        )
        .filter((item) => item.reportStatus !== "Rejected")
        .map((i) => ({
          curriculumCode: i.coursePlanCode,
          curriculumId: i.coursePlanId,
          curriculumTitle: i.coursePlanTitle,
          endDate: i.endDate,
          endYear: i.endYear?.toString(),
          grant:
            typeof i.totalGrantActual === "number"
              ? i.totalGrantActual - (i.facilitationGrantActual || 0)
              : typeof i.totalGrantGranted === "number"
              ? i.totalGrantGranted - (i.facilitationGrantGranted || 0)
              : undefined,
          hours: i.hours,
          ID: i.caseNumber,
          locationCode: i.locationCode,
          organizationCode: i.memberOrganizationCode || "000",
          organizationName:
            (i.memberOrganizationCode || "000") !== "000"
              ? i.memberOrganizationName
              : i.tenantName,
          organizerId: i.applicantOrganizationId,
          organizerName: i.applicantName,
          participants:
            (i.participantCountMale || 0) + (i.participantCountFemale || 0),
          startDate: i.startDate,
          status:
            i.reportStatus === "Approved"
              ? CourseStatuses.DONE
              : CourseStatuses.PLANNED,
          title: i.courseTitle,
        }))
    );
  }
}

/**
 *
 * @param {import("node-fetch").Response} res
 * @returns
 */
function checkStatus(res) {
  if (res.ok) {
    // res.status >= 200 && res.status < 300
    return res;
  } else {
    throw new Error(res.statusText);
  }
}

//const eapply = new EapplyAdapter();

module.exports = { EapplyAdapter: EapplyAdapter };
