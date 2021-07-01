const CourseStatuses = {
  PLANNED: 2,
  DONE: 7,
};

const configDefaults = {
  useTitleColumn: false,
  hidePlannedGrants: false,
  showFacilitationGrants: false,
};

/**
 * 
 * @param {*} config 
 * @returns {{
      hidePlannedGrants?: boolean;
      reportSchema?: string;
      showFacilitationGrants?: boolean;
      useTitleColumn?: boolean;
    }
 }
 */
function getConfig(config = {}) {
  return { ...configDefaults, ...config };
}

module.exports = { CourseStatuses, getConfig };
