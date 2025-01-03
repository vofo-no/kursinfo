"use server";

import { getTenantDataUrl, uncompressTenantData } from "@kursinfo/julien";

import { userFromCookies } from "@/lib/user-from-cookies";

export async function fetchStatisticsData(year: number) {
  const user = await userFromCookies();
  const scope = user?.customClaims.scope;

  if (!scope) throw "Not allowed";
  if (year < 2020 || year > new Date().getFullYear()) throw "Invalid year arg";

  return await fetch(getTenantDataUrl(scope, String(year)))
    .then((res) => res.text())
    .then(uncompressTenantData)
    .then((data) => data.items);
}
