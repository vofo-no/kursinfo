const chalk = require("chalk");
const settings = require("./settings.json");
const fs = require("fs");
const path = require("path");
const getCounties = require("../lib/getCounties");
const smartCase = require("../lib/smartCase");

const EapplyAdapter = require("./adapters/eapply").EapplyAdapter;
const { CourseStatuses, getConfig } = require("./constants");
const makeShortAggregate = require("./helpers/makeShortAggregate");

const force = process.argv[2] === "--hard";
if (force) {
  console.log(
    chalk.yellow("Overskriver eksisterende datafiler fordi `--hard` er angitt.")
  );
} else {
  console.log(chalk.yellow("Overskriver ikke eksisterende datafiler."));
}

/**
 * @constant
 * @type {Record<string, import("../types/courses").Adapter>}
 */
const adapters = { eapply: new EapplyAdapter() };

/** Sync last year's data until the end of this month. */
const LAST_YEAR_UNTIL_MONTH = 3;

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
   @returns {Promise<import("../types/courses").ITenantData>}
 */
const getData = async (tenant, year) => {
  const adapter = adapters[tenant.adapter];

  if (!adapter) throw new Error(`Unknown adapter ${tenant.adapter}`);

  const countyData = getCounties(year);

  const data = await adapter.get(tenant.id, year);

  const { hidePlannedGrants, reportSchema, useTitleColumn } = getConfig(
    tenant.config
  );

  /** @type Array<string> */
  const organizations = [];
  /** @type Set<string> */
  const organizationCodes = new Set();

  const organizerIds = {};
  const curriculumIds = {};

  const counties = countyData.map(({ region }) => region);
  const countyParams = countyData.map(({ param }) => param);

  const getCountyIndex = (locationCode) => {
    if (isNaN(locationCode)) return null;
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
    }
  );

  // Sort curriculums alphabetically
  const sortedCurriculumIds = Object.keys(curriculumIds).sort((a, b) =>
    curriculumIds[a].localeCompare(curriculumIds[b], "nb")
  );
  const curriculums = sortedCurriculumIds.map((key) =>
    String(curriculumIds[key])
  );

  // Sort organizers alphabetically
  const sortedOrganizerIds = Object.keys(organizerIds).sort((a, b) =>
    organizerIds[a].localeCompare(organizerIds[b], "nb")
  );
  const organizers = sortedOrganizerIds.map((key) => String(organizerIds[key]));

  // Sort organizations alphabetically
  const organizationParams = Array.from(organizationCodes).sort((a, b) =>
    organizations[Number(a)].localeCompare(organizations[Number(b)], "nb")
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

    const filterKeys = ["endDate", "endYear", "grant", "participants"];

    const optionalProps = Object.fromEntries(
      Object.entries(item).filter(([key]) => filterKeys.includes(key))
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
      reportSchema: reportSchema && item.status === CourseStatuses.PLANNED,
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
  };
};

function getTaskYears() {
  const today = new Date();
  const currYear = today.getFullYear();
  const years = [String(currYear), String(currYear + 1)];
  if (today.getMonth() < LAST_YEAR_UNTIL_MONTH)
    years.unshift(String(currYear - 1));
  return years;
}

async function doWork({ tenant, year }) {
  const outpath = `data/${tenant.dataTarget}/${year}.json`;
  const filepath = path.join(process.cwd(), outpath);

  if (fs.existsSync(filepath) && !force) {
    console.log(
      chalk.green(
        "✅ Data finnes allerede på disk [" +
          chalk.blue(tenant.name) +
          " (" +
          chalk.blue(year) +
          ")], hopper over."
      )
    );
  } else {
    const loopJobName = chalk.green(
      "✅ Hentet data [" +
        chalk.blue(tenant.name) +
        " (" +
        chalk.blue(year) +
        ")]"
    );
    console.time(loopJobName);

    console.log(
      `=> Henter data for [${chalk.blue(tenant.name)} (${chalk.blue(
        year
      )})] fra [${chalk.blue(tenant.adapter)}]...`
    );

    const data = await getData(tenant, year);

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

(async () => {
  try {
    const programExecutionTimer = chalk.green(
      "✅ By the power vested in me, by the law of the jungle, blah, blah, blah, blah... Be gone!"
    );
    console.time(programExecutionTimer);

    console.log(
      chalk.blueBright(
        "🥥 [robot voice] I am very clever king... tok tok tok tok... I am super genius... I am robot king of the monkey thing... compute... compute."
      )
    );

    const tasks = [];
    const taskYears = getTaskYears();

    settings.tenants.map((tenant) => {
      taskYears.map((year) => tasks.push({ tenant, year }));
    });

    for (let task of tasks) {
      await doWork(task);
    }

    console.timeEnd(programExecutionTimer);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
