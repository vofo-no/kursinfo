import { unstable_cache } from "next/cache";
import { getTenantYears } from "@kursinfo/julien";

export function getTenantYearsCached(sf: string) {
  return unstable_cache(
    async () => {
      return getTenantYears(sf);
    },
    [sf],
    {
      tags: [`sf:${sf}`],
    },
  )();
}
