const Papa = require("papaparse");
const fs = require("fs");
const CourseStatuses = require("../constants").CourseStatuses;
const Adapter = require("./adapterBase");
const settings = require("../settings.json");

const { COL, sumParticipants } = require("../../chewie/han");

/**
 *
 * @param {string} header
 * @returns string
 */
function fixHeader(header) {
  return header.replace(/[\s()/-]/g, "_").replace(/\./g, "");
}

/**
 * Fix known issues with raw CSV file
 * @param {string} raw
 * @returns string
 */
function fixCsvString(raw) {
  return raw
    .replace(/^.*/, (firstLine) =>
      firstLine
        .normalize("NFC")
        .replace(/å/gi, "aa")
        .replace(/ø/gi, "o")
        .replace(/æ/gi, "ae")
    )
    .replace(/;"([^;"\n]*)"([^;"\n]*)"([^;"\n]*)";/g, ';"$1""$2""$3";')
    .replace(/;"([^;"\n]*)"";/g, ';"$1""";')
    .replace(/;""([^;"\n]*)";/g, ';"""$1";');
}

/**
 *
 * @param {string} raw
 * @returns string
 */
function isoDate(raw, row) {
  if (typeof raw !== "string")
    throw new Error(
      `Unexpected argument type: ${typeof raw} / ${raw}\n\n${JSON.stringify(
        row
      )}`
    );

  const parts = raw.split(".");
  parts.reverse();
  return parts.join("-");
}

/**
 *
 * @param {string} orgId
 * @param {Array<OrgItem>} orgs
 * @returns OrgItem
 */
function getTopOrg(orgId, orgs) {
  let curr = orgs.find((org) => org.ID === orgId);

  while (curr && curr.Overordnet_ID && curr.Overordnet_ID !== "1") {
    curr = orgs.find((org) => org.ID === curr.Overordnet_ID);
  }

  return curr || orgs.find((org) => org.ID === "1");
}

/**
 *
 * @param {string} courseId
 * @param {Array<Array<any>>} ssbData
 */
function getSsbDataRow(courseId, ssbData) {
  const row = ssbData.find((i) => i[COL.ID] == courseId);
  if (!row) throw new Error(`Course not in SSB report: ${courseId}`);
  return row;
}

/**
 *
 * @param {Array<any>} ssbRow
 * @returns {string}
 */
function patchLocationCode(ssbRow) {
  return String(ssbRow[COL.MUNICIPALITY]).padStart(4, "0");
}

/**
 *
 * @param {Array<any>} ssbRow
 * @returns {number}
 */
function patchParticipants(ssbRow) {
  return sumParticipants([ssbRow.map(Number)]);
}

class KasAdapter extends Adapter {
  toString() {
    return "KAS";
  }

  /**
   * @private
   * @param {string} tenantDataTarget
   * @param {string} year
   * @returns {Promise<Array<import("./kas").KasCourse>>}
   */
  async fetch(tenantDataTarget, year) {
    const fileName = `data/raw/${tenantDataTarget}/kas${year}.csv`;

    if (!fs.existsSync(fileName))
      throw new Error(`Expected data on: ${fileName}`);

    const localFile = fixCsvString(fs.readFileSync(fileName, "latin1"));

    /** @type {Papa.ParseConfig<import("./kas").KasCourse>} */
    const config = {
      delimiter: ";",
      dynamicTyping: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: fixHeader,
    };
    const file = Papa.parse(localFile, config);

    return file.data;
  }

  /**
   * @typedef {{
   *    ID: string;
   *    Navn: string;
   *    Studieforbundnr__SSB_?: string;
   *    Overordnet_ID?: string;
   * }} OrgItem
   */
  /**
   * @private
   * @param {string} tenantDataTarget
   * @returns {Array<OrgItem>}
   */
  fetchOrgs(tenantDataTarget) {
    const fileName = `data/raw/${tenantDataTarget}/kasORG.csv`;

    if (!fs.existsSync(fileName))
      throw new Error(`Expected data on: ${fileName}`);

    const localFile = fixCsvString(fs.readFileSync(fileName, "latin1"));

    /** @type {Papa.ParseConfig<OrgItem>} */
    const config = {
      delimiter: ";",
      header: true,
      skipEmptyLines: true,
      transformHeader: fixHeader,
    };
    const file = Papa.parse(localFile, config);

    return file.data;
  }

  /**
   *
   * @param {string} year
   * @param {string} tenantDataTarget
   * @returns {Array<any>}
   */
  fetchSsbData(year, tenantDataTarget) {
    const fileName = `data/raw/g${year}.csv`;

    if (!fs.existsSync(fileName))
      throw new Error(`Expected data on: ${fileName}`);

    const localFile = fs.readFileSync(fileName, "utf-8");

    /** @type {Papa.ParseConfig<any>} */
    const config = {};
    const file = Papa.parse(localFile, config);

    return file.data.filter((i) => i[COL.ASSOCIATION] === tenantDataTarget);
  }

  /**
   *
   * @param {string} tenantId
   * @param {string} year
   * @returns {Promise<Array<import("../../types/courses").Course>>}
   */
  async get(tenantId, year) {
    const tenantDataTarget = settings.tenants.find(
      (tenant) => tenant.id === tenantId
    ).dataTarget;

    const orgs = this.fetchOrgs(tenantDataTarget);
    const ssbData = this.fetchSsbData(year, tenantDataTarget);

    return this.fetch(tenantDataTarget, year).then((data) =>
      data.map((i) => {
        const topOrg = getTopOrg(String(i.Arrangor_id), orgs);
        const ssbRow = getSsbDataRow(
          String(i.Kurs_id).padStart(7, "0"),
          ssbData
        );
        /** @type {import("../../types/courses").Course} */
        const course = {
          curriculumCode: String(i.Studieplan_id),
          curriculumId: String(i.Studieplan_id),
          curriculumTitle: i.Studieplannavn,
          endDate: isoDate(i.Sluttdato, i),
          facilitationGrant: i.Tilrettelegging_sum,
          grant: i.Opplaeringstilskudd + (i.Tilrettelegging_sum || 0),
          hours: i.Timer_totalt,
          ID: String(i.Kurs_id),
          locationCode: patchLocationCode(ssbRow),
          organizationCode: topOrg.Studieforbundnr__SSB_.padStart(3, "0"),
          organizationName: topOrg.Navn,
          organizerId: String(i.Arrangor_id),
          organizerName: i.Arrangor_navn,
          participants: patchParticipants(ssbRow),
          startDate: isoDate(i.Startdato, i),
          status: CourseStatuses.DONE,
          title: i.Kursnavn,
        };
        return course;
      })
    );
  }
}

module.exports = { KasAdapter };
