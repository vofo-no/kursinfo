const parameterize = require("./parameterize");
const config = require("../data/config.json");

function getCounties(year) {
  const configYear = Object.keys(config)
    .sort((a, b) => b - a)
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

module.exports = getCounties;
