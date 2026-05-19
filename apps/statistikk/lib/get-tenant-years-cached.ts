import { cacheLife } from "next/cache";
import { getTenantYears } from "@kursinfo/julien";

export async function getTenantYearsCached(sf: string) {
  "use cache";
  cacheLife("daily");

  return getTenantYears(sf);
}
