import getCounties from "lib/getCounties";
import { cache } from "react";

export const makeTitle = cache((year: string, county: string) => {
  const countyOptions = getCounties(year).map((c) => [c.param, c.region]);

  const parts = [
    `Kursstatistikk ${year}`,
    (countyOptions.find((el) => el[0] === county) || [])[1],
  ];
  return parts.filter(Boolean).join(", ");
});
