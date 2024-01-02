import "server-only";

import { readdirSync } from "fs";
import { join } from "path";

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
  let year = new Date().getFullYear();

  if (!tenant) return year.toString();

  const tenantDataPath = join(process.cwd(), `data/${tenant}`);
  const years = readdirSync(tenantDataPath, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => Number.parseInt(item.name.split(".")[0]));

  if (!years.length) return year.toString();

  return years
    .reduce((prev, curr) =>
      Math.abs(curr - year) < Math.abs(prev - year) ? curr : prev,
    )
    .toString();
}

export default function getDefaultParams({
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
