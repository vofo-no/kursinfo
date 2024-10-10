import config from "@/data/config.json";

import parameterize from "@/lib/parameterize";

export default function getCounties(year: string): Array<{
  region: string;
  param: string;
  keys: Set<unknown>;
}> {
  const configYear = Object.keys(config)
    .sort((a, b) => b.localeCompare(a, "nb"))
    .find((key) => Number(key) <= Number(year));

  if (!configYear)
    throw new Error(
      `Year before or on "${year}" is not defined in data/config.json.`,
    );

  const configItem: {
    futureRegions?: string[];
    regions: Record<string, number[]>;
  } = config[configYear as keyof typeof config];

  const futureSet = new Set(configItem.futureRegions);
  const regions = Object.keys(configItem.regions).filter(
    (key) => !futureSet.has(key),
  );

  return regions.map((region) => ({
    region,
    param: parameterize(region),
    keys: new Set(configItem.regions[region]),
  }));
}
