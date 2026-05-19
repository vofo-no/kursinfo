import { cacheLife, cacheTag } from "next/cache";
import { BlobNotFoundError, head } from "@vercel/blob";
import { uncompressTenantData } from "@vofo-no/kursinfo-lite";

import { getTenantYearsCached } from "./get-tenant-years-cached";

async function getTenantDataCached(sf: string, year: string) {
  "use cache";
  cacheTag(`sf:${sf}:${year}`);
  cacheLife("daily");

  const validYears = await getTenantYearsCached(sf);

  if (!validYears.includes(year)) return;

  try {
    const metadata = await head(`sf-data/v1/${sf}/${year}.json`);
    const response = await fetch(metadata.url);

    if (response.ok) {
      const data = await response.text();
      return uncompressTenantData(data);
    }
  } catch (e) {
    if (e instanceof BlobNotFoundError) return;
    throw e;
  }
}

export default getTenantDataCached;
