import { DEFAULT_COUNTY_PARAM } from "@/lib/constants";
import getCounties from "@/lib/getCounties";

import Select from "./Select";

interface Props {
  year: string;
}

export default function SelectCounty({ year }: Props) {
  const counties: [string, string][] = getCounties(year).map((c) => [
    c.param,
    c.region,
  ]);
  const countyOptions: [string, string][] = [
    [DEFAULT_COUNTY_PARAM, "Hele landet"],
    ...counties,
  ];

  return (
    <Select aria-label="Velg fylke" options={countyOptions} propName="county" />
  );
}
