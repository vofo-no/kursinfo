import { cache } from "react";
import { getTenantDataUrl, uncompressTenantData } from "@vofo-no/kursinfo-lite";

export const getTenantData = cache(async (tenant: string, year: string) => {
  const tenantUrl = getTenantDataUrl(tenant, year);
  const response = await fetch(tenantUrl, {
    next: { tags: [`sf:${tenant}:${year}`] },
  });

  if (response.ok) {
    const text = await response.text();
    return uncompressTenantData(text);
  }
});
