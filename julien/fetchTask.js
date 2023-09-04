const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const getCounties = require("../lib/getCounties");
const smartCase = require("../lib/smartCase");

const { CourseStatuses, getConfig } = require("./constants");
const makeShortAggregate = require("./helpers/makeShortAggregate");

const stripISODate = (raw) => {
  if (typeof raw !== "string") return raw;
  return raw.split("T", 2)[0];
};

/**
 * 
 * @param {{
    id: string;
    name: string;
    adapter: string;
    dataTarget: string;
    config?: {
      hidePlannedGrants?: boolean;
      reportSchema?: string;
      useTitleColumn?: boolean;
    }
   }} tenant 
 * @param {string} year
   @param {import("../types/courses").Adapter} adapter
   @returns {Promise<import("../types/courses").ITenantData>}
 */
const getData = async (tenant, year, adapter) => {
  const countyData = getCounties(year);

  const data = await adapter.get(tenant.id, year);

  const {
    hideExtraGrants,
    hidePlannedGrants,
    reportSchema,
    showFacilitationGrants,
    showGrantsSpecifications,
    useAllParticipants,
    useTitleColumn,
  } = getConfig(tenant.config);

  /** @type Array<string> */
  const organizations = [];
  /** @type Set<string> */
  const organizationCodes = new Set();

  const organizerIds = {};
  const curriculumIds = {};

  const counties = countyData.map(({ region }) => region);
  const countyParams = countyData.map(({ param }) => param);

  /**
   *
   * @param {number} locationCode 3-4 digits municipality code
   * @returns {number} index for county in countyData, -1 otherwise
   */
  const getCountyIndex = (locationCode) => {
    if (isNaN(locationCode)) return -1;
    const countyCode = Math.floor(locationCode / 100);
    return countyData.findIndex(({ keys }) => keys.has(countyCode));
  };

  // Prepare indices
  data.map(
    ({
      organizerId,
      organizerName,
      curriculumCode,
      curriculumId,
      curriculumTitle,
      organizationCode,
      organizationName,
    }) => {
      // Store curriculum name
      curriculumIds[curriculumId] = [curriculumCode, curriculumTitle].join(" ");

      // Store organizer name
      organizerIds[organizerId] = smartCase(organizerName);

      // Index organizationCode
      organizations[Number(organizationCode)] = smartCase(organizationName);
      organizationCodes.add(organizationCode);
    },
  );

  // Sort curriculums alphabetically
  const sortedCurriculumIds = Object.keys(curriculumIds).sort((a, b) =>
    curriculumIds[a].localeCompare(curriculumIds[b], "nb"),
  );
  const curriculums = sortedCurriculumIds.map((key) =>
    String(curriculumIds[key]),
  );

  // Sort organizers alphabetically
  const sortedOrganizerIds = Object.keys(organizerIds).sort((a, b) =>
    organizerIds[a].localeCompare(organizerIds[b], "nb"),
  );
  const organizers = sortedOrganizerIds.map((key) => String(organizerIds[key]));

  // Sort organizations alphabetically
  const organizationParams = Array.from(organizationCodes).sort((a, b) =>
    organizations[Number(a)].localeCompare(organizations[Number(b)], "nb"),
  );

  /** @type {Array<import("../types/courses").IndexedCourseItem>} */
  const items = data.map((item) => {
    const countyIndex = getCountyIndex(Number(item.locationCode));
    const curriculumIndex = sortedCurriculumIds.indexOf(item.curriculumId);
    const organizerIndex = sortedOrganizerIds.indexOf(item.organizerId);

    item.startDate = stripISODate(item.startDate);
    if (item.endDate) item.endDate = stripISODate(item.endDate);

    if (hidePlannedGrants && item.status === CourseStatuses.PLANNED) {
      delete item.grant;
    }

    if (hideExtraGrants) {
      if (item.grant && item.extraGrant) item.grant -= item.extraGrant;
      delete item.extraGrant;
    }

    if (!showFacilitationGrants) {
      if (item.grant && item.facilitationGrant)
        item.grant -= item.facilitationGrant;
      delete item.facilitationGrant;
    }

    const filterKeys = ["endDate", "endYear", "grant"];

    const optionalProps = Object.fromEntries(
      Object.entries(item).filter(([key]) => filterKeys.includes(key)),
    );

    return {
      ...optionalProps,
      countyIndex,
      curriculumIndex,
      hours: item.hours,
      ID: item.ID,
      locationCode: item.locationCode,
      organizationCode: item.organizationCode,
      organizerIndex,
      participants: useAllParticipants
        ? item.participantsAll
        : item.participants,
      startDate: item.startDate,
      status: item.status,
      title: item.title,
    };
  });

  return {
    buildTime: new Date().toISOString(),
    counties,
    countyParams,
    curriculums,
    organizationParams,
    organizers,
    organizations,
    items,
    reportSchema,
    useTitleColumn,
    showFacilitationGrants,
    showGrantsSpecifications,
  };
};

/**
 * 
 * @param {{
 *  tenant: {
        id: string;
        name: string;
        adapter: string;
        dataTarget: string;
        config?: {
            hidePlannedGrants?: boolean;
            reportSchema?: string;
            useTitleColumn?: boolean;
        };
    };
    year: string;
   }} task
 * @param {import("../types/courses").Adapter} adapter
 * @param {boolean} force
 */
async function fetchTask({ tenant, year }, adapter, force) {
  const outpath = `data/${tenant.dataTarget}/${year}.json`;
  const filepath = path.join(process.cwd(), outpath);

  if (!force && fs.existsSync(filepath)) {
    console.log(
      chalk.green(
        "✅ Data finnes allerede på disk [" +
          chalk.blue(tenant.name) +
          " (" +
          chalk.blue(year) +
          ")], hopper over.",
      ),
    );
  } else {
    const loopJobName = chalk.green(
      "✅ Hentet data [" +
        chalk.blue(tenant.name) +
        " (" +
        chalk.blue(year) +
        ")]",
    );
    console.time(loopJobName);

    console.log(
      `=> Henter data for [${chalk.blue(tenant.name)} (${chalk.blue(
        year,
      )})] fra [${chalk.blue(adapter)}]...`,
    );

    const data = await getData(tenant, year, adapter);

    if (Number(year) === new Date().getFullYear()) {
      const aggData = makeShortAggregate(data);
      const aggPath = `public/${tenant.dataTarget}-short.json`;
      const aggFilePath = path.join(process.cwd(), aggPath);
      console.log(`=> Lagrer sammendrag i [${chalk.blue(aggPath)}]...`);
      const wstream = fs.createWriteStream(aggFilePath);
      wstream.write(JSON.stringify(aggData));
      wstream.end();
    }

    if (data.items.length) {
      const dirpath = path.dirname(filepath);
      if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath);
      }
      console.log(`=> Lagrer data i [${chalk.blue(outpath)}]...`);
      const wstream = fs.createWriteStream(filepath);
      wstream.write(JSON.stringify(data));
      wstream.end();
    } else {
      if (fs.existsSync(filepath)) {
        console.log(`=> Sletter [${chalk.blue(outpath)}] (ingen kurs)...`);
        fs.unlinkSync(filepath);
      }
    }

    console.timeEnd(loopJobName);
  }
}

module.exports = fetchTask;
