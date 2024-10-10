import { cache } from "react";
import { getTenantDataUrl, uncompressTenantData } from "@kursinfo/julien";

const cachedUncompressTenantData = cache(uncompressTenantData);

async function getTenantData(tenant: string, year: string) {
  const tenantUrl = getTenantDataUrl(tenant, year);
  const response = await fetch(tenantUrl, {
    next: { tags: [`sf:${tenant}:${year}`] },
  });

  if (response.ok) {
    const data = await response.text();
    return cachedUncompressTenantData(data);
  } else {
    undefined;
  }
}

export default getTenantData;
