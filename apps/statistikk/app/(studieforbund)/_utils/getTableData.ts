import "server-only";

import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "@/lib/constants";
import getTenantData from "@/lib/getTenantData";
import { GroupType } from "@/app/(studieforbund)/_components/CoursesTable/constants";

export async function getTableData(
  tenant: string,
  year: string,
  county: string = "",
  organization: string = "",
  group: GroupType | undefined = undefined,
) {
  const data = await getTenantData(tenant, year);

  if (!data) return undefined;

  if (county && county !== DEFAULT_COUNTY_PARAM) {
    const i = data.countyParams.indexOf(county);
    if (i > -1) {
      data.items = data.items.filter(({ countyIndex }) => countyIndex == i);
    }
  }

  if (organization && organization !== DEFAULT_ORGANIZATION_PARAM) {
    data.items = data.items.filter(
      ({ organizationCode }) => organizationCode === organization,
    );
  }

  switch (
    group
    // TODO
  ) {
  }

  return data;
}
