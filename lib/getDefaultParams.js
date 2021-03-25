const {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
  DEFAULT_GROUP_PARAM,
} = require("./constants");

getDefaultParams = ({ year, county, organization, group } = {}) => {
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
