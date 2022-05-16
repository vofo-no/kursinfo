const CourseStatuses = {
  PLANNED: 2,
  DONE: 7,
};

const configDefaults = {
  useTitleColumn: false,
  hideExtraGrants: false,
  hidePlannedGrants: false,
  showFacilitationGrants: false,
};

/**
 * @typedef {object} Config
 * @property {boolean} hideExtraGrants
 * @property {boolean} hidePlannedGrants
 * @property {string} [reportSchema]
 * @property {boolean} showFacilitationGrants
 * @property {boolean} useTitleColumn
 */

/**
 * Merges partial config with default values.
 * @param {Partial<Config>} config
 * @returns {Config}
 */
function getConfig(config = {}) {
  return { ...configDefaults, ...config };
}

module.exports = { CourseStatuses, getConfig };
