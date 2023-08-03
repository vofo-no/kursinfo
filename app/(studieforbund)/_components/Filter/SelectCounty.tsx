import { DEFAULT_COUNTY_PARAM } from "lib/constants";
import getCounties from "lib/getCounties";

import Select from "./Select";

interface Props {
  year: string;
  county: string;
}

export default async function SelectCounty({ year, county }: Props) {
  const counties = await getCounties(year).map((c) => [c.param, c.region]);
  const countyOptions = [[DEFAULT_COUNTY_PARAM, "Hele landet"], ...counties];

  return (
    <Select
      aria-label="Velg fylke"
      value={county}
      options={countyOptions}
      propName="county"
    />
  );
}
