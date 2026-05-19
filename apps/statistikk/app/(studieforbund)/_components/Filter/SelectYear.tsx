import { getTenantYearsCached } from "@/lib/get-tenant-years-cached";

import Select from "./Select";

interface Props {
  tenant: string;
}

export default async function SelectYear({ tenant }: Props) {
  const options = await getTenantYearsCached(tenant);

  return <Select aria-label="Velg årstall" options={options} propName="year" />;
}
