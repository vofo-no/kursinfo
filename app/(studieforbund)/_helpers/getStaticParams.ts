import { GROUPS } from "app/(studieforbund)/_components/CoursesTable/constants";
import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "lib/constants";
import getCounties from "lib/getCounties";
import getTenantYears from "lib/getTenantYears";
import { CoursesParams } from "types/courses";

function getStaticParams(tenant: string): CoursesParams[] {
  const paths: CoursesParams[] = [];
  const years = getTenantYears(tenant);

  years.map((year) => {
    [...getCounties(year), { param: DEFAULT_COUNTY_PARAM }].map(
      ({ param: county }) =>
        [DEFAULT_ORGANIZATION_PARAM].map((organization) => {
          [GROUPS[2], GROUPS[3], GROUPS[4]].map((group) => {
            if (group === "fylker" && county !== DEFAULT_COUNTY_PARAM) return;
            paths.push({ year, county, organization, group });
          });
        }),
    );
  });

  return paths;
}

export default getStaticParams;
