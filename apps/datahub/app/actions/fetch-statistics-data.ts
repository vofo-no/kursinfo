"use server";

import { getTenantDataUrl, uncompressTenantData } from "@kursinfo/julien";

import { getTokensFromCookies } from "@/lib/get-tokens-from-cookies";
import { toUser } from "@/lib/user";

export async function fetchStatisticsData(year: number) {
  const tokens = await getTokensFromCookies();
  const user = tokens ? toUser(tokens) : null;
  const { scope } = user?.customClaims || {};

  if (!scope) throw "Not allowed";
  if (year < 2020 || year > new Date().getFullYear()) throw "Invalid year arg";

  return await fetch(getTenantDataUrl(scope, String(year)))
    .then((res) => res.text())
    .then(uncompressTenantData)
    .then((data) => data.items);
}
