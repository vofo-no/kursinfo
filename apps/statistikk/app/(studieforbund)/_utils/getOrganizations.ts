import "server-only";

import { cache } from "react";

import getTenantDataCached from "@/lib/get-tenant-data-cached";

export const getOrganizations = cache(async (tenant: string, year: string) => {
  const { organizationParams, organizations } = (await getTenantDataCached(
    tenant,
    year,
  )) || { organizationParams: [], organizations: [] };

  return organizationParams.map<[string, string]>((item) => [
    item,
    organizations[Number(item)] || item,
  ]);
});
