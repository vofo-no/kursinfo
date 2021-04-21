const config = require("../data/config.json");
const parameterize = require("./parameterize");

/**
 *
 * @param {string} year
 * @returns {Array<{
 *  region: string;
 *  param: string;
 *  keys: Set<unknown>;
 * }>}
 */
function getCounties(year) {
  const configYear = Object.keys(config)
    .sort((a, b) => b.localeCompare(a, "nb"))
    .find((key) => Number(key) <= Number(year));

  if (!configYear)
    throw new Error(
      `Year before or on "${year}" is not defined in data/config.json.`
    );

  const configItem = config[configYear];

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
