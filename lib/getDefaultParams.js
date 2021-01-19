getDefaultParams = ({ year, county, group } = {}) => {
  if (!year) year = new Date().getFullYear().toString();
  if (!county) county = "hele-landet";
  if (!group) group = "kurs";

  return {
    year,
    county,
    group,
  };
};

module.exports = getDefaultParams;
