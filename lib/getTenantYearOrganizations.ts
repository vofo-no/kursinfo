import getTenantData from "./getTenantData";

function getTenantYearOrganizations(
  tenant: string,
  year: string
): Array<string> {
  const { organizationParams } = getTenantData(tenant, year);

  return organizationParams;
}

export default getTenantYearOrganizations;
