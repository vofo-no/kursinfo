import "server-only";

import getTenantData from "lib/getTenantData";
import { cache } from "react";

export const preload = (tenant: string, year: string) => {
  void getOrganizations(tenant, year);
};

export const getOrganizations = cache(async (tenant: string, year: string) => {
  const { organizationParams, organizations } = getTenantData(tenant, year);

  return organizationParams.map((item) => [item, organizations[Number(item)]]);
});
