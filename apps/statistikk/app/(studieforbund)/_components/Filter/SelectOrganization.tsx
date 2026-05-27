import { DEFAULT_ORGANIZATION_PARAM } from "@/lib/constants";

import Select from "./Select";

interface Props {
  organizations: [string, string][];
}

export default async function SelectOrganization({ organizations }: Props) {
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
