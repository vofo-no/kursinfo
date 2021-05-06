/**
 * @typedef {{
 *  name: string;
 *  code: string;
 *  courses: number;
 *  coursesPlanned: number;
 *  hours: number;
 *  hoursPlanned: number;
 * }} OrganizationAggregate
 * @typedef {{
 *  buildTime: string;
 *  organizations: Array<OrganizationAggregate>;
 * }} ShortAggregate
 */

const { CourseStatuses } = require("../constants");

/**
 * 
 * @param {import("../../types/courses").ITenantData} data
   @returns {ShortAggregate}
 */
const makeShortAggregate = (data) => {
  /** @type {ShortAggregate} */
  const result = {
    buildTime: data.buildTime,
    organizations: data.organizationParams
      .map((code) =>
        analyzeOrganization(
          code,
          data.organizations[Number(code)],
          data.items.filter((item) => item.organizationCode === code)
        )
      )
      .sort((a, b) => b.hoursPlanned - a.hoursPlanned)
      .sort((a, b) => b.hours - a.hours),
  };
  return result;
};

/**
 *
 * @param {import("../../types/courses").ITenantData["items"]} items
 * @param {string} name
 * @param {string} code
 * @returns {OrganizationAggregate}
 */
const analyzeOrganization = (code, name, items) => {
  /** @type {OrganizationAggregate} */
  const out = {
    name,
    code,
    courses: 0,
    coursesPlanned: 0,
    hours: 0,
    hoursPlanned: 0,
  };

  return items.reduce((result, item) => {
    if (item.status === CourseStatuses.DONE) {
      result.hours += item.hours;
      result.courses++;
    } else {
      result.hoursPlanned += item.hours;
      result.coursesPlanned++;
    }
    return result;
  }, out);
};

module.exports = makeShortAggregate;
