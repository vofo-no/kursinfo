/**
 * R2 is responsible for typechecking and storing data.
 *
 * @typedef { import("../types/reports").IAssociationReport } IAssociationReport
 * @typedef { import("../types/reports").IComboReport } IComboReport
 * @typedef { import("../types/reports").IRegionReport } IRegionReport
 * @typedef { import("../types/reports").IGlobalReport } IGlobalReport
 * @typedef { IAssociationReport | IRegionReport | IComboReport | IGlobalReport } IAnyReport
 */
class Storage {
  constructor() {
    /** @type {Record<string, IAnyReport>} */
    this.reports = {};
    /** @type {Array<string>} */
    this.regions = [];
    /** @type {Array<string>} */
    this.associations = [];
  }

  /**
   * @param {string} key
   * @param {IAssociationReport} values
   */
  setAssociationReport(key, values) {
    this.associations.push(key);
    this.reports[key] = values;
  }

  /**
   * @param {string} key
   * @param {IRegionReport} values
   */
  setRegionReport(key, values) {
    this.regions.push(key);
    this.reports[key] = values;
  }

  /**
   * @param {string} key
   * @param {IComboReport} values
   */
  setTotalReport(key, values) {
    this.reports[key] = values;
  }

  /**
   * @param {string} key
   * @param {IGlobalReport} values
   */
  setGlobalReport(key, values) {
    this.reports[key] = values;
  }

  data() {
    return {
      reports: this.reports,
      regions: this.regions,
      associations: this.associations,
    };
  }
}

module.exports = Storage;
