import { getOrganizations } from "app/(studieforbund)/_utils/getOrganizations";
import { DEFAULT_ORGANIZATION_PARAM } from "lib/constants";

import Select from "./Select";

interface Props {
  year: string;
  tenant: string;
  organization: string;
}

export default async function SelectOrganization({
  year,
  tenant,
  organization,
}: Props) {
  const organizations = await getOrganizations(tenant, year);
  const organizationOptions = [
    [DEFAULT_ORGANIZATION_PARAM, "Alle organisasjoner"],
    ...organizations,
  ];

  return (
    <Select
      aria-label="Velg organisasjon"
      value={organization}
      options={organizationOptions}
      propName="organization"
    />
  );
}
