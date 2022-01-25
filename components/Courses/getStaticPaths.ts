import { GetStaticPathsResult } from "next";

import getCounties from "../../lib/getCounties";
import getTenantYears from "../../lib/getTenantYears";
import { CoursesParams } from "../../types/courses";
import {
  ALL_COUNTIES_OPTION,
  ALL_ORGANIZATIONS_OPTION,
  GROUPS,
} from "./constants";

type PathsType = Array<{ params: CoursesParams }>;

async function getStaticPaths(
  tenant: string
): Promise<GetStaticPathsResult<CoursesParams>> {
  const paths: PathsType = [];
  const years = getTenantYears(tenant);

  years.map((year) => {
    [...getCounties(year), { param: ALL_COUNTIES_OPTION[0] }].map(
      ({ param: county }) =>
        [ALL_ORGANIZATIONS_OPTION[0]].map((organization) => {
          [GROUPS[2], GROUPS[3], GROUPS[4]].map((group) => {
            if (group === "fylker" && county !== ALL_COUNTIES_OPTION[0]) return;
            paths.push({ params: { year, county, organization, group } });
          });
        })
    );
  });

  return { paths, fallback: "blocking" };
}

export default getStaticPaths;
