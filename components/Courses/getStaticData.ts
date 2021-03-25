import getCounties from "../../lib/getCounties";
import getTenantData from "../../lib/getTenantData";
import getTenantYears from "../../lib/getTenantYears";
import {
  ALL_COUNTIES_OPTION,
  ALL_ORGANIZATIONS_OPTION,
  CoursesParams,
  GroupType,
  IAggregatedData,
} from "./constants";

/**
 * Aggregates data.
 * @param data
 * @param key to group by
 * @param getName function to get name by data item
 * @returns
 */
const aggregate = (
  data: Array<any>,
  key: string,
  getName: (item: any) => string
) => {
  return Object.values(
    data.reduce<{ [key: string]: IAggregatedData }>((rv, add) => {
      const item: IAggregatedData = rv[add[key]] || {
        id: add[key],
        name: getName(add),
        plannedCourses: 0,
        plannedHours: 0,
        courses: 0,
        hours: 0,
        participants: 0,
        grant: 0,
      };
      if (add.planned) {
        item.plannedCourses += 1;
        item.plannedHours += add.hours || 0;
      } else {
        item.courses += 1;
        item.hours += add.hours || 0;
        item.participants += add.participantCountTotal || 0;
        item.grant += add.totalGrantActual || 0;
      }
      rv[add[key]] = item;
      return rv;
    }, {})
  );
};

interface StaticDataProps {
  props: {
    county: string;
    countyOptions: string[][];
    data: any;
    group: GroupType;
    organization: string;
    organizationOptions: string[];
    year: string;
    yearOptions: string[];
  };
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
      ({ organizationId }) => organizationId === organization
    );
  }

  if (group === "organisasjoner") {
    data.tabular = aggregate(
      data.items,
      "organizationId",
      ({ organizationIndex }) => data.organizers[organizationIndex]
    );
  }

  const props = {
    county,
    countyOptions: [
      ALL_COUNTIES_OPTION,
      ...counties.map((c) => [c.param, c.region]),
    ],
    ...data,
    group,
    organization,
    organizationOptions: [
      ALL_ORGANIZATIONS_OPTION,
      ...data.organizationParams.map((item) => [item, item]),
    ],
    year,
    yearOptions,
  };

  return {
    props,
  };
};

export default getStaticData;
