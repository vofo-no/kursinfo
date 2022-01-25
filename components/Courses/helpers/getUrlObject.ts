import { ParsedUrlQuery } from "querystring";
import { CoursesParams } from "types/courses";
import { UrlObject } from "url";

import { isDefaultCounty, isDefaultOrganization } from "../constants";

const getUrlObject = (
  pathname: string,
  routerQuery: ParsedUrlQuery,
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
  const mergedQuery: ParsedUrlQuery = { ...routerQuery, ...query };
  delete mergedQuery.page;

  return {
    pathname,
    query: mergedQuery,
  };
};

export default getUrlObject;
