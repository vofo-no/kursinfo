import { unstable_cache } from "next/cache";
import { BlobNotFoundError, head } from "@vercel/blob";
import { uncompressTenantData } from "@vofo-no/kursinfo-lite";

import { getTenantYearsCached } from "./get-tenant-years-cached";

function loadCompressedTenantData(sf: string, year: string) {
  return unstable_cache(
    async () => {
      console.log("loading tenant data", sf, year);
      const validYears = await getTenantYearsCached(sf);

      if (!validYears.includes(year)) return;

      try {
        const metadata = await head(`sf-data/v1/${sf}/${year}.json`);
        const response = await fetch(metadata.url);

        if (response.ok) {
          const data = await response.text();
          return data;
        }
      } catch (e) {
        if (e instanceof BlobNotFoundError) return;
        throw e;
      }
    },
    [sf, year],
    {
      tags: [`sf:${sf}:${year}`],
    },
  )();
}

async function getTenantDataCached(sf: string, year: string) {
  const data = await loadCompressedTenantData(sf, year);
  if (!data) return;
  return uncompressTenantData(data);
}

export default getTenantDataCached;
