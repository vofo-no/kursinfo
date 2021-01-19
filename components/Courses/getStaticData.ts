import getCounties from "../../lib/getCounties";
import getTenantData from "../../lib/getTenantData";
import getTenantYears from "../../lib/getTenantYears";
import { ALL_COUNTIES_OPTION, GroupType } from "./constants";

interface ParamType {
  year: string;
  county: string;
  group: GroupType;
}

interface StaticDataProps {
  props: {
    county: string;
    countyOptions: string[][];
    data: any;
    group: GroupType;
    year: string;
  };
}

const getStaticData = async (
  { year, county, group }: ParamType,
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

  const props = {
    county,
    countyOptions: [
      ALL_COUNTIES_OPTION,
      ...counties.map((c) => [c.param, c.region]),
    ],
    ...data,
    group,
    year,
    yearOptions,
  };

  return {
    props,
  };
};

export default getStaticData;
