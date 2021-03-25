import getCounties from "../../lib/getCounties";
import getTenantYears from "../../lib/getTenantYears";
import getTenantYearOrganizations from "../../lib/getTenantYearOrganizations";
import {
  ALL_COUNTIES_OPTION,
  ALL_ORGANIZATIONS_OPTION,
  CoursesParams,
  GROUPS,
} from "./constants";

async function getStaticPaths(tenant: string) {
  const paths: Array<{ params: CoursesParams }> = [];
  const years = getTenantYears(tenant);

  years.map((year) => {
    [...getCounties(year), { param: ALL_COUNTIES_OPTION[0] }].map(
      ({ param: county }) =>
        [
          ...getTenantYearOrganizations(tenant, year),
          ALL_ORGANIZATIONS_OPTION[0],
        ].map((organization) => {
          GROUPS.map((group) => {
            if (group === "fylker" && county !== ALL_COUNTIES_OPTION[0]) return;
            if (
              group === "organisasjoner" &&
              organization !== ALL_ORGANIZATIONS_OPTION[0]
            )
              return;
            paths.push({ params: { year, county, organization, group } });
          });
        })
    );
  });

  return { paths, fallback: false };
}

export default getStaticPaths;
