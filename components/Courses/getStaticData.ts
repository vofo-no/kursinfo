import getCounties from "../../lib/getCounties";
import getTenantData from "../../lib/getTenantData";
import getTenantYears from "../../lib/getTenantYears";
import { CoursesParams } from "../../types/courses";
import {
  ALL_COUNTIES_OPTION,
  ALL_ORGANIZATIONS_OPTION,
  CoursesProps,
} from "./constants";

interface StaticDataProps {
  props: CoursesProps;
}

const getStaticData = async (
  { year, county, group, organization }: CoursesParams,
  tenant: string
): Promise<StaticDataProps> => {
  const yearOptions = getTenantYears(tenant);
  if (!yearOptions.includes(year))
    throw new Error(`Year ${year} not found for tenant ${tenant}.`);

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
      ...data.organizationParams.map((item, index) => [
        item,
        data.organizations[index],
      ]),
    ],
    year,
    yearOptions,
  };

  return {
    props,
  };
};

export default getStaticData;
