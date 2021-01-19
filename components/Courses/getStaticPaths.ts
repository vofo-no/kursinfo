import getCounties from "../../lib/getCounties";
import getTenantYears from "../../lib/getTenantYears";
import { ALL_COUNTIES_OPTION, GROUPS } from "./constants";

async function getStaticPaths(tenant: string) {
  const paths = [];
  const years = getTenantYears(tenant);

  years.map((year) => {
    [...getCounties(year), { param: ALL_COUNTIES_OPTION[0] }].map(
      ({ param: county }) =>
        GROUPS.map((group) => {
          paths.push({ params: { year, county, group } });
        })
    );
  });

  return { paths, fallback: false };
}

export default getStaticPaths;
