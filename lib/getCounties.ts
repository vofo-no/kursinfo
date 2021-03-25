import config from "../data/config.json";
import parameterize from "./parameterize";

function getCounties(
  year: string
): Array<{
  region: string;
  param: string;
  keys: Set<unknown>;
}> {
  const configYear = Object.keys(config)
    .sort((a, b) => a.localeCompare(b))
    .find((key) => Number(key) <= Number(year));
  const configItem = config[configYear];

  if (!configItem)
    throw new Error(
      `Year before or on "${year}" is not defined in data/config.json.`
    );

  const futureSet = new Set(configItem.futureRegions);
  const regions = Object.keys(configItem.regions).filter(
    (key) => !futureSet.has(key)
  );

  return regions.map((region) => ({
    region,
    param: parameterize(region),
    keys: new Set(configItem.regions[region]),
  }));
}

export default getCounties;
