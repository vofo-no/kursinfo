/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_GROUP_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} = require("./constants");

/**
 *
 * @param {{
 *   year?: string;
 *   county?: string;
 *   organization?: string;
 *   group?: string;
 * }}
 * @returns {{
 *   year: string;
 *   county: string;
 *   organization: string;
 *   group: string;
 * }}
 */
const getDefaultParams = ({ year, county, organization, group } = {}) => {
  if (!year) year = new Date().getFullYear().toString();
  if (!county) county = DEFAULT_COUNTY_PARAM;
  if (!organization) organization = DEFAULT_ORGANIZATION_PARAM;
  if (!group) group = DEFAULT_GROUP_PARAM;

  return {
    year,
    county,
    organization,
    group,
  };
};

module.exports = getDefaultParams;
