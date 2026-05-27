import "server-only";

import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "@/lib/constants";
import { getTenantData } from "@/lib/get-tenant-data";

export async function getTableData(
  tenant: string,
  year: string,
  county: string = "",
  organization: string = "",
) {
  const data = await getTenantData(tenant, year);
  if (!data) return undefined;

  let { items } = data;

  if (county && county !== DEFAULT_COUNTY_PARAM) {
    const i = data.countyParams.indexOf(county);
    if (i > -1) items = items.filter(({ countyIndex }) => countyIndex === i);
  }

  if (organization && organization !== DEFAULT_ORGANIZATION_PARAM) {
    items = items.filter(
      ({ organizationCode }) => organizationCode === organization,
    );
  }

  const usedOrganizerIndexes = new Set(items.map((i) => i.organizerIndex));
  const usedCurriculumIndexes = new Set(items.map((i) => i.curriculumIndex));

  return {
    ...data,
    items,
    organizers: data.organizers.map((v, i) =>
      usedOrganizerIndexes.has(i) ? v : "",
    ),
    curriculums: data.curriculums.map((v, i) =>
      usedCurriculumIndexes.has(i) ? v : "",
    ),
  };
}
