import {
  DEFAULT_COUNTY_PARAM,
  DEFAULT_ORGANIZATION_PARAM,
} from "@/lib/constants";

import { isDefaultCounty } from "./isDefaultCounty";
import { isDefaultOrganization } from "./isDefaultOrganization";

export const unsetSpecific = (
  tab: string,
  { organization, county }: { organization: string; county: string },
) => {
  if (tab === "fylker" && !isDefaultCounty(county))
    return { county: DEFAULT_COUNTY_PARAM };
  if (tab === "organisasjoner" && !isDefaultOrganization(organization))
    return { organization: DEFAULT_ORGANIZATION_PARAM };
  return {};
};
