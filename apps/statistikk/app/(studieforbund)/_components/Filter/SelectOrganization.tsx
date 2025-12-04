import { DEFAULT_ORGANIZATION_PARAM } from "@/lib/constants";
import { getOrganizations } from "@/app/(studieforbund)/_utils/getOrganizations";

import Select from "./Select";

interface Props {
  year: string;
  tenant: string;
}

export default async function SelectOrganization({ year, tenant }: Props) {
  const organizations = await getOrganizations(tenant, year);
  const organizationOptions: [string, string][] = [
    [DEFAULT_ORGANIZATION_PARAM, "Alle organisasjoner"],
    ...organizations,
  ];

  return (
    <Select
      aria-label="Velg organisasjon"
      options={organizationOptions}
      propName="organization"
    />
  );
}
