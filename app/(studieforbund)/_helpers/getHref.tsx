import { StudieforbundParams } from "../types";
import { isDefaultCounty } from "./isDefaultCounty";
import { isDefaultOrganization } from "./isDefaultOrganization";

export default function getHref(
  prefix: string,
  oldParams: StudieforbundParams,
  newParams: Partial<StudieforbundParams>,
  page: string | number | undefined = undefined,
): string {
  if (!newParams.group) {
    if (
      newParams.county &&
      !isDefaultCounty(newParams.county) &&
      oldParams.group === "fylker"
    ) {
      newParams.group = !isDefaultOrganization(
        newParams.organization || oldParams.organization,
      )
        ? "lag"
        : "organisasjoner";
    }
    if (
      newParams.organization &&
      !isDefaultOrganization(newParams.organization) &&
      oldParams.group === "organisasjoner"
    ) {
      newParams.group = !isDefaultCounty(newParams.county || oldParams.county)
        ? "lag"
        : "fylker";
    }
  }

  const { year, county, organization, group } = {
    ...oldParams,
    ...newParams,
  };

  return `/${prefix}/${year}/${county}/${organization}/${group}`;
}
