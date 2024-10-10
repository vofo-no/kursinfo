import { decompress } from "compress-json";

import { getTenantSettings } from "./get-tenant-settings";
import { afterMaxLastYear } from "./helpers/after-max-last-year";
import { ITenantData } from "./types";

export function getTenantDataUrl(tenant: string, year: string) {
  return `https://lg3wcd5gxfh37h0h.public.blob.vercel-storage.com/sf-data/v1/${tenant}/${year}.json`;
}

export async function uncompressTenantData(data: string): Promise<ITenantData> {
  const programExecutionTimer = "🕺 Uncompressing...";
  console.time(programExecutionTimer);

  const result = decompress(await JSON.parse(data));

  console.timeEnd(programExecutionTimer);
  return result;
}

function arrayRange(start: number, stop: number) {
  return Array.from({ length: stop - start + 1 }, (_, index) => start + index);
}

export function getTenantYears(tenant: string) {
  const { firstYear } = getTenantSettings(tenant) || {};

  if (!firstYear) return [];

  const isAfterMaxLastYear = afterMaxLastYear();
  const lastYear = new Date().getFullYear() + (isAfterMaxLastYear ? 1 : 0);

  return arrayRange(firstYear, lastYear).map(String);
}
