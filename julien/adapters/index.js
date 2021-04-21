/**
 * Common interface for adapters
 *
 * @interface
 */
class Adapter {
  constructor() {}

  /**
   *
   * @param {string} tenantId
   * @param {string} year
   * @returns {Promise<Array<import("../../types/courses").Course>>} Array of courses
   */
  // eslint-disable-next-line no-unused-vars
  async get(tenantId, year) {
    throw new Error("not implemented");
  }
}

module.exports = Adapter;
