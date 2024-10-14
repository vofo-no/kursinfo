import "server-only";

import { getTenantYears } from "@kursinfo/julien";

import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_GROUP_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "./constants";
import getTenantData from "./getTenantData";

interface getDefaultParamsProps {
  year?: string;
  county?: string;
  organization?: string;
  group?: string;
  tenant?: string;
}

async function checkedTenantYear(tenant?: string) {
  const year = new Date().getFullYear();

  if (!tenant) return year.toString();

  const years = getTenantYears(tenant);

  if (years.length < 3) return year.toString();

  const hitCurrentYear = await getTenantData(tenant, year.toString()).then(
    (data) => Boolean(data?.items.length),
  );

  return hitCurrentYear ? year.toString() : (year - 1).toString();
}

export default async function getDefaultParams({
  year,
  county,
  organization,
  group,
  tenant,
}: getDefaultParamsProps = {}) {
  if (!year) year = await checkedTenantYear(tenant);
  if (!county) county = DEFAULT_COUNTY_PARAM;
  if (!organization) organization = DEFAULT_ORGANIZATION_PARAM;
  if (!group) group = DEFAULT_GROUP_PARAM;

  return {
    year,
    county,
    organization,
    group,
  };
}
