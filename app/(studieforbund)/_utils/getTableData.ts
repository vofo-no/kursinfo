import "server-only";

import { GroupType } from "app/(studieforbund)/_components/CoursesTable/constants";
import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "lib/constants";
import getTenantData from "lib/getTenantData";
import { cache } from "react";

export const preload = (
  tenant: string,
  year: string,
  county: string = "",
  organization: string = "",
  group: GroupType | undefined = undefined,
) => {
  void getTableData(tenant, year, county, organization, group);
};

export const getTableData = cache(
  async (
    tenant: string,
    year: string,
    county: string = "",
    organization: string = "",
    group: GroupType | undefined = undefined,
  ) => {
    const data = getTenantData(tenant, year);

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
  },
);
