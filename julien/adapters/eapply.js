const fetch = require("node-fetch").default;
const AbortController = require("abort-controller").default;
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
    /** @type {Array<import("./eapply").EapplyCourse>} */
    let result = [];
    const controller = new AbortController();
    const credentials = [process.env.EAPPLY_USER, process.env.EAPPLY_TOKEN];

    /** @type {import("node-fetch").HeaderInit} */
    const headers = {
      Authorization: `Basic ${Buffer.from(credentials.join(":")).toString(
        "base64"
      )}`,
      "Content-Type": "application/json",
    };

    /** @type {import("node-fetch").RequestInit} */
    const options = {
      method: "GET",
      headers,
      signal: controller.signal,
    };

    const url = `${process.env.EAPPLY_URL}/api/v1/courses?limit=99999&tenantId=${tenantId}&endDateFrom=01.01.${year}&endDateTo=31.12.${year}`;

    const timeout = setTimeout(() => controller.abort(), 15000);
    await fetch(url, options)
      .then(checkStatus)
      .then(
        (response) => response.json(),
        (error) => {
          if (error.name === "AbortError")
            throw new Error("Fetch request timed out.");
          throw error;
        }
      )
      .then((data) => (result = data))
      .finally(() => clearTimeout(timeout));

    return result;
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
        .filter((item) => item.decision !== "Rejected")
        .map((i) => ({
          curriculumCode: i.coursePlanCode,
          curriculumId: i.coursePlanId,
          curriculumTitle: i.coursePlanTitle,
          endDate: i.endDate,
          endYear: i.endYear?.toString(),
          grant:
            typeof i.totalGrant === "number"
              ? i.totalGrant - (i.facilitationGrant || 0)
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
          participants: i.participantsTotal,
          startDate: i.startDate,
          status:
            i.courseStatus === "Completed"
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
    return res;
  } else {
    throw new Error(res.statusText);
  }
}

module.exports = { EapplyAdapter: EapplyAdapter };
