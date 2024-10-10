import "server-only";

import { cache } from "react";

import getTenantData from "@/lib/getTenantData";

export const preload = (tenant: string, year: string) => {
  void getOrganizations(tenant, year);
};

export const getOrganizations = cache(async (tenant: string, year: string) => {
  const { organizationParams, organizations } = (await getTenantData(
    tenant,
    year,
  )) || { organizationParams: [], organizations: [] };

  return organizationParams.map((item) => [item, organizations[Number(item)]]);
});
