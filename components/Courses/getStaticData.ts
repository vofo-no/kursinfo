import getCounties from "lib/getCounties";
import getTenantData from "lib/getTenantData";
import getTenantName from "lib/getTenantName";
import getTenantYears from "lib/getTenantYears";
import { GetStaticPropsResult } from "next";
import { CoursesParams } from "types/courses";

import {
  ALL_COUNTIES_OPTION,
  ALL_ORGANIZATIONS_OPTION,
  CoursesProps,
} from "./constants";

const getStaticData = async (
  { year, county, group, organization }: CoursesParams,
  tenant: string
): Promise<GetStaticPropsResult<CoursesProps>> => {
  const yearOptions = getTenantYears(tenant);
  if (!yearOptions.includes(year)) return { notFound: true };

  const data = getTenantData(tenant, year);
  const counties = getCounties(year);

  if (county && county !== ALL_COUNTIES_OPTION[0]) {
    const i = data.countyParams.indexOf(county);
    if (i > -1) {
      data.items = data.items.filter(({ countyIndex }) => countyIndex == i);
    }
  }

  if (organization && organization !== ALL_ORGANIZATIONS_OPTION[0]) {
    data.items = data.items.filter(
      ({ organizationCode }) => organizationCode === organization
    );
  }

  const props: CoursesProps = {
    tenantName: getTenantName(tenant),
    ...data,
    county,
    countyOptions: [
      ALL_COUNTIES_OPTION,
      ...counties.map((c) => [c.param, c.region]),
    ],
    group,
    organization,
    organizationOptions: [
      ALL_ORGANIZATIONS_OPTION,
      ...data.organizationParams.map((item) => [
        item,
        data.organizations[Number(item)],
      ]),
    ],
    year,
    yearOptions,
  };

  return {
    props,
    revalidate: 600,
  };
};

export default getStaticData;
