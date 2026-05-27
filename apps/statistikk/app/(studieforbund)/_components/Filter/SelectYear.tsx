import { getTenantYears } from "@kursinfo/julien";

import Select from "./Select";

interface Props {
  tenant: string;
}

export default async function SelectYear({ tenant }: Props) {
  const options = getTenantYears(tenant);

  return <Select aria-label="Velg årstall" options={options} propName="year" />;
}
