import { Association, INamed, Organization } from "types/reports";

import organizations from "../../../data/names/organizations.json";

export default function getNamedOrganizationsFromData(
  sf: string,
  year: number,
  associations: Array<Association & { key: string }>
): Array<Organization> {
  if (!(sf in organizations)) return [];

  const nameSet = organizations[sf as keyof typeof organizations];
  const yearSet = Object.keys(nameSet).filter(
    (nameSetYear) => Number(nameSetYear) <= year
  );

  const names: Record<string, INamed> = yearSet.reduce(
    (oldNames, key) => ({
      ...oldNames,
      ...nameSet[key as keyof typeof nameSet],
    }),
    {}
  );

  return associations.map((item) => ({
    ...item,
    ...names[item.key],
  }));
}
