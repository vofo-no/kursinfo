import fs from "fs";
import { COL, sumParticipants } from "@kursinfo/ssb-sdk";
import Papa from "papaparse";

import { CourseStatuses } from "../constants";
import settings from "../settings.json";
import { Adapter, Course } from "../types";

interface OrgItem {
  ID: string;
  Navn: string;
  Studieforbundnr__SSB_?: string;
  Overordnet_ID?: string;
}

interface KasCourse {
  BATCH_ID: string;
  Kurs_id: string;
  Kursnavn: string;
  Kurssted: string;
  Kurs_Kommunenr: string;
  Org_Id: string;
  Org_navn: string;
  Produkt: string;
  Kursomraade_id: string;
  Kursomraade_navn: string;
  Semester: string;
  Status: string;
  SSB: string;
  SSB_Arrangor_navn: string;
  Arrangor_id: string;
  Arrangor_navn: string;
  Startdato: string;
  Sluttdato: string;
  Org_Kommune_nr: string;
  Tiltakstype: string;
  Tidspunkt: string;
  Tidspunkt_kode: string;
  Nivaa: string;
  Nivaa_kode: string;
  Emnekode: string;
  Emnenavn_SSB_: string;
  Studieplan_id: number;
  Studieplannavn: string;
  Timer_med_laerer: number;
  Timer_uten_laerer: number;
  Timer_online: number;
  Timer_totalt: number;
  Antall_tilskb_deltakere: number;
  Opplaeringstilskudd: number;
  Tilrettelegging_sum: number;
  Menn_sum: number;
  Kvinner_sum: number;
  Sum_antall_deltakere: number;
  Tilrettelegging__Ja_Nei_: string;
  Statstotte__Ja_Nei_: string;
  RC_STATUS: string;
  FINAL_STATUS: string;
  RC_SUM_COSTS: number;
  RC_SUM_INCOME: number;
}

function fixHeader(header: string) {
  return header.replace(/[\s()/-]/g, "_").replace(/\./g, "");
}

/**
 * Fix known issues with raw CSV file
 * @param {string} raw
 * @returns string
 */
function fixCsvString(raw: string) {
  return raw
    .replace(/^.*/, (firstLine) =>
      firstLine
        .normalize("NFC")
        .replace(/å/gi, "aa")
        .replace(/ø/gi, "o")
        .replace(/æ/gi, "ae"),
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
function isoDate(raw: unknown, row: any) {
  if (typeof raw !== "string")
    throw new Error(
      `Unexpected argument type: ${typeof raw} / ${raw}\n\n${JSON.stringify(
        row,
      )}`,
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
function getTopOrg(orgId: string, orgs: Array<OrgItem>) {
  let curr = orgs.find((org) => org.ID === orgId);

  while (curr && curr.Overordnet_ID && curr.Overordnet_ID !== "1") {
    curr = orgs.find((org) => org.ID === curr?.Overordnet_ID);
  }

  return curr || orgs.find((org) => org.ID === "1");
}

/**
 *
 * @param {string} courseId
 * @param {Array<Array<any>>} ssbData
 */
function getSsbDataRow(courseId: string, ssbData: Array<Array<any>>) {
  const row = ssbData.find((i) => i[COL.ID] == courseId);
  if (!row) throw new Error(`Course not in SSB report: ${courseId}`);
  return row;
}

function patchLocationCode(ssbRow: Array<any>): string {
  return String(ssbRow[COL.MUNICIPALITY]).padStart(4, "0");
}

function patchParticipants(ssbRow: Array<any>): number {
  return sumParticipants([ssbRow.map(Number)]);
}

export class KasAdapter implements Adapter {
  toString() {
    return "KAS";
  }

  /**
   * @private
   */
  async fetch(tenantDataTarget: string, year: string): Promise<KasCourse[]> {
    const fileName = `data/raw/${tenantDataTarget}/kas${year}.csv`;

    if (!fs.existsSync(fileName))
      throw new Error(`Expected data on: ${fileName}`);

    const localFile = fixCsvString(fs.readFileSync(fileName, "latin1"));

    const config: Papa.ParseConfig<KasCourse> = {
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
   * @private
   */
  fetchOrgs(tenantDataTarget: string): Array<OrgItem> {
    const fileName = `data/raw/${tenantDataTarget}/kasORG.csv`;

    if (!fs.existsSync(fileName))
      throw new Error(`Expected data on: ${fileName}`);

    const localFile = fixCsvString(fs.readFileSync(fileName, "latin1"));

    const config: Papa.ParseConfig<OrgItem> = {
      delimiter: ";",
      header: true,
      skipEmptyLines: true,
      transformHeader: fixHeader,
    };
    const file = Papa.parse(localFile, config);

    return file.data;
  }

  fetchSsbData(year: string, tenantDataTarget: string): Array<any> {
    const fileName = `data/raw/g${year}.csv`;

    if (!fs.existsSync(fileName))
      throw new Error(`Expected data on: ${fileName}`);

    const localFile = fs.readFileSync(fileName, "utf-8");

    /** @type {Papa.ParseConfig<any>} */
    const config: Papa.ParseConfig<any> = {};
    const file = Papa.parse(localFile, config);

    return file.data.filter((i) => i[COL.ASSOCIATION] === tenantDataTarget);
  }

  async get(tenantId: string, year: string): Promise<Course[]> {
    const tenantDataTarget = settings.tenants.find(
      (tenant) => tenant.id === tenantId,
    )?.dataTarget;

    if (!tenantDataTarget) throw new Error("Unknown data target (tenant id)");

    const orgs = this.fetchOrgs(tenantDataTarget);
    const ssbData = this.fetchSsbData(year, tenantDataTarget);

    return this.fetch(tenantDataTarget, year).then((data) =>
      data.map((i) => {
        const topOrg = getTopOrg(String(i.Arrangor_id), orgs);
        const ssbRow = getSsbDataRow(
          String(i.Kurs_id).padStart(7, "0"),
          ssbData,
        );
        const course: Course = {
          curriculumCode: String(i.Studieplan_id),
          curriculumId: String(i.Studieplan_id),
          curriculumTitle: i.Studieplannavn,
          endDate: isoDate(i.Sluttdato, i),
          facilitationGrant: i.Tilrettelegging_sum,
          grant: i.Opplaeringstilskudd + (i.Tilrettelegging_sum || 0),
          hours: i.Timer_totalt,
          ID: String(i.Kurs_id),
          locationCode: patchLocationCode(ssbRow),
          organizationCode:
            topOrg?.Studieforbundnr__SSB_?.padStart(3, "0") || "999",
          organizationName: topOrg?.Navn || "UKJENT",
          organizerId: String(i.Arrangor_id),
          organizerName: i.Arrangor_navn,
          participants: patchParticipants(ssbRow),
          startDate: isoDate(i.Startdato, i),
          status: CourseStatuses.DONE,
          title: i.Kursnavn,
        };
        return course;
      }),
    );
  }
}
