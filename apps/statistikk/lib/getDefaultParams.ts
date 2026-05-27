import { getTenantYears } from "@kursinfo/julien";

import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_GROUP_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "./constants";

interface getDefaultParamsProps {
  year?: string;
  county?: string;
  organization?: string;
  group?: string;
  tenant?: string;
}

function checkedTenantYear(tenant?: string) {
  const year = new Date().getFullYear().toString();

  if (!tenant) return year;

  const years = getTenantYears(tenant);
  if (years.length < 3) return year;
  return years.at(-2) || year;
}

export default async function getDefaultParams({
  year,
  county,
  organization,
  group,
  tenant,
}: getDefaultParamsProps = {}) {
  if (!year) year = checkedTenantYear(tenant);
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
