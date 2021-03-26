/**
 * Common interface for adapters
 *
 * @interface
 */
class Adapter {
  constructor() {}
  /**
   * Get data from the adapter.
   *
   * @param {string} tenantId
   * @param {string} year
   * @returns {Promise<{
   *   applicantName: string,
   *   applicantOrganizationId: string,
   *   caseNumber: string,
   *   coursePlanCode?: string,
   *   coursePlanId: string,
   *   coursePlanTitle: string,
   *   courseStatus: string,
   *   courseTitle: string,
   *   endDate?: string,
   *   hours: number,
   *   locationCode: string,
   *   memberOrganizationId?: string,
   *   memberOrganizationName?: string,
   *   participantCountTotal?: number,
   *   reportStatus?: string,
   *   startDate: string
   * }[]>}
   */
  async get(tenantId, year) {
    throw new Error("not implemented");
  }
}

module.exports = Adapter;
