import { DEFAULT_COUNTY_PARAM } from "@/lib/constants";
import getCounties from "@/lib/getCounties";

import Select from "./Select";

interface Props {
  year: string;
}

export default function SelectCounty({ year }: Props) {
  const counties = getCounties(year).map((c) => [c.param, c.region]);
  const countyOptions = [[DEFAULT_COUNTY_PARAM, "Hele landet"], ...counties];

  return (
    <Select aria-label="Velg fylke" options={countyOptions} propName="county" />
  );
}
