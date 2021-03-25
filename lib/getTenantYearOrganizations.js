const getTenantData = require("./getTenantData");

function getTenantYearOrganizations(tenant, year) {
  const { organizationParams } = getTenantData(tenant, year);

  return organizationParams;
}

module.exports = getTenantYearOrganizations;
