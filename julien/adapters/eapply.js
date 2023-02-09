const fetch = require("node-fetch").default;
const AbortController = require("abort-controller").default;
const CourseStatuses = require("../constants").CourseStatuses;
const Adapter = require("./adapterBase");

class EapplyAdapter extends Adapter {
  toString() {
    return "Eapply";
  }

  /**
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

    const LIMIT = 250;

    for (let offset = 0; offset < LIMIT * 1000; offset += LIMIT) {
      if (result.length < offset) break;

      const url = `${process.env.EAPPLY_URL}/api/v1/courses?offset=${offset}&limit=${LIMIT}&tenantId=${tenantId}&endDateFrom=01.01.${year}&endDateTo=31.12.${year}`;

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
        .then((data) => result.push(...data))
        .finally(() => clearTimeout(timeout));
    }

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
        .map((i) => {
          /** @type {import("../../types/courses").Course} */
          const course = {
            curriculumCode: i.coursePlanCode,
            curriculumId: i.coursePlanId,
            curriculumTitle: i.coursePlanTitle,
            endDate: i.endDate,
            endYear: i.endYear?.toString(),
            extraGrant: i.extraGrant,
            facilitationGrant: i.facilitationGrant,
            grant: typeof i.totalGrant === "number" ? i.totalGrant : undefined,
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
            participants: i.validParticipantsTotal,
            participantsAll: i.participantsTotal,
            startDate: i.startDate,
            status:
              i.amountApproved > 0
                ? CourseStatuses.DONE
                : CourseStatuses.PLANNED,
            title: i.courseTitle,
          };
          return course;
        })
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

module.exports = { EapplyAdapter };
