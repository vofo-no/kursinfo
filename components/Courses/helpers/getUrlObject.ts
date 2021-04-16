import { NextRouter } from "next/router";
import { CoursesParams } from "types/courses";
import { UrlObject } from "url";

import { isDefaultCounty, isDefaultOrganization } from "../constants";

const getUrlObject = (
  router: NextRouter,
  query: Partial<CoursesParams> = {},
  {
    group,
    organization,
    county,
  }: Pick<CoursesParams, "group" | "organization" | "county">
): UrlObject => {
  if (!query.group) {
    if (query.county && !isDefaultCounty(query.county) && group === "fylker") {
      query.group = !isDefaultOrganization(query.organization || organization)
        ? "lag"
        : "organisasjoner";
    }
    if (
      query.organization &&
      !isDefaultOrganization(query.organization) &&
      group === "organisasjoner"
    ) {
      query.group = !isDefaultCounty(query.county || county) ? "lag" : "fylker";
    }
  }
  return {
    pathname: router.pathname,
    query: { ...router.query, ...query },
  };
};

export default getUrlObject;
