import "server-only";

import getTenantYears from "lib/getTenantYears";
import { cache } from "react";

export const preload = (tenant: string) => {
  void getYears(tenant);
};

export const getYears = cache(async (tenant: string) => {
  return getTenantYears(tenant);
});
