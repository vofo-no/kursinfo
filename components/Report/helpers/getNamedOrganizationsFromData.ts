import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Association, INamed, Organization } from "types/reports";

export default function getNamedOrganizationsFromData(
  sf: string,
  associations: Array<Association & { key: string }>
): Array<Organization> {
  const namePath = join(process.cwd(), `data/names/orgs/${sf}.json`);

  if (!existsSync(namePath)) return [];

  const names: Record<string, INamed> = JSON.parse(
    readFileSync(namePath, "utf-8")
  );

  return associations.map((item) => ({
    ...item,
    ...names[item.key],
  }));
}
