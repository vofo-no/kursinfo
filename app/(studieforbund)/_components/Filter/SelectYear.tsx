import { getYears } from "../../_utils/getYears";
import Select from "./Select";

interface Props {
  tenant: string;
  year: string;
}

export default async function SelectYear({ tenant, year }: Props) {
  const options = await getYears(tenant);

  return (
    <Select
      aria-label="Velg årstall"
      value={year}
      options={options}
      propName="year"
    />
  );
}
