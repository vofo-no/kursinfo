const chalk = require("chalk");
const settings = require("./settings.json");
const fs = require("fs");
const getCounties = require("../lib/getCounties");
const smartCase = require("../lib/smartCase");

const eapply = require("./adapters/eapply");
const Adapter = require("./adapters");
/**
 * @constant
 * @type {Record<string, Adapter>}
 */
const adapters = { eapply };

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
    reportSchema?: string;
   }} tenant 
 * @param {string} year 
 */
const getData = async (tenant, year) => {
  const adapter = adapters[tenant.adapter];

  if (!adapter) throw new Error(`Unknown adapter ${tenant.adapter}`);

  const countyData = getCounties(year);

  const data = await adapter.get(tenant.id, year).then((data) =>
    data
      .filter((item) => item.applicationStatus === "Granted")
      .filter((item) => item.reportStatus !== "Rejected")
      .filter((item) =>
        String(item.endDate || item.endYear || item.startDate).startsWith(
          String(year)
        )
      )
  );

  const { reportSchema } = tenant;

  /** @type Set<string> */
  const memberOrganizationIds = new Set();
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
      applicantOrganizationId,
      applicantName,
      coursePlanCode,
      coursePlanId,
      coursePlanTitle,
      memberOrganizationId,
      memberOrganizationName,
    }) => {
      // Store curriculum name
      curriculumIds[coursePlanId] = [coursePlanCode, coursePlanTitle].join(" ");

      // Store organizer name
      organizerIds[applicantOrganizationId] = smartCase(applicantName);

      if (memberOrganizationId) {
        // Store member organization name
        organizerIds[memberOrganizationId] = smartCase(memberOrganizationName);

        memberOrganizationIds.add(memberOrganizationId);
      }
    }
  );

  // Add or reset tenant name
  organizerIds[tenant.id] = tenant.name;

  // Sort curriculums alphabetically
  const sortedCurriculumIds = Object.keys(curriculumIds).sort((a, b) =>
    curriculumIds[a].localeCompare(curriculumIds[b], "no")
  );
  const curriculums = sortedCurriculumIds.map((key) =>
    String(curriculumIds[key])
  );

  // Sort organizers alphabetically
  const sortedOrganizerIds = Object.keys(organizerIds).sort((a, b) =>
    organizerIds[a].localeCompare(organizerIds[b], "no")
  );
  const organizers = sortedOrganizerIds.map((key) => String(organizerIds[key]));

  const organizationParams = sortedOrganizerIds.filter(
    Set.prototype.has,
    memberOrganizationIds
  );

  const items = data.map(
    ({
      applicantOrganizationId,
      caseNumber,
      coursePlanId,
      courseStatus,
      courseTitle,
      endDate,
      hours,
      locationCode,
      memberOrganizationId,
      participantCountTotal = undefined,
      reportStatus,
      startDate,
    }) => {
      const countyIndex = getCountyIndex(Number(locationCode));
      const curriculumIndex = sortedCurriculumIds.indexOf(coursePlanId);
      const organizerIndex = sortedOrganizerIds.indexOf(
        applicantOrganizationId
      );
      const organizationId =
        memberOrganizationId === tenant.id
          ? applicantOrganizationId
          : memberOrganizationId || tenant.id;
      const organizationIndex = sortedOrganizerIds.indexOf(organizationId);

      return {
        caseNumber,
        countyIndex,
        curriculumIndex,
        coursePlanId,
        courseStatus,
        courseTitle,
        endDate: stripISODate(endDate),
        hours,
        locationCode,
        organizationId,
        organizationIndex,
        organizerIndex,
        participantCountTotal,
        planned: !reportStatus,
        reportSchema: reportSchema && !reportStatus,
        reportStatus,
        startDate: stripISODate(startDate),
      };
    }
  );

  return {
    counties,
    countyParams,
    curriculums,
    organizationParams,
    organizers,
    items,
    reportSchema,
  };
};

function getTaskYears() {
  const today = new Date();
  const currYear = today.getFullYear();
  const years = [currYear, currYear + 1];
  if (today.getMonth() < LAST_YEAR_UNTIL_MONTH) years.unshift(currYear - 1);
  return years;
}

async function process({ tenant, year }) {
  const loopJobName = chalk.green(
    "✅ Hentet data [" +
      chalk.blue(tenant.name) +
      " (" +
      chalk.blue(year) +
      ")]"
  );
  console.time(loopJobName);

  try {
    console.log(
      `=> Henter data for [${chalk.blue(tenant.name)} (${chalk.blue(
        year
      )})] fra [${chalk.blue(tenant.adapter)}]...`
    );

    const data = await getData(tenant, year);

    const filepath = `data/${tenant.dataTarget}/${year}.json`;
    if (data.items.length) {
      console.log(`=> Lagrer data i [${chalk.blue(filepath)}]...`);
      const wstream = fs.createWriteStream(filepath);
      wstream.write(JSON.stringify(data));
      wstream.end();
    } else {
      if (fs.existsSync(filepath)) {
        console.log(`=> Sletter [${chalk.blue(filepath)}] (ingen kurs)...`);
        fs.unlinkSync(filepath);
      }
    }

    console.timeEnd(loopJobName);
  } catch (error) {
    console.error(error);
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
      await process(task);
    }

    console.timeEnd(programExecutionTimer);
  } catch (error) {
    console.error(error);
  }
})();
