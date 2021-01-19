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
const LAST_YEAR_UNTIL_MONTH = 2;

const stripISODate = (raw) => {
  if (typeof raw !== "string") return raw;
  return raw.split("T", 2)[0];
};

const getData = async (tenant, year) => {
  const adapter = adapters[tenant.adapter];

  if (!adapter) throw new Error(`Unknown adapter ${tenant.adapter}`);

  process.stdout.write(
    `Data ${tenant.id} from ${tenant.adapter} (${year})... `
  );

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
    }) => {
      // Store curriculum name
      curriculumIds[coursePlanId] = [coursePlanCode, coursePlanTitle].join(" ");

      // Store organizer name
      organizerIds[applicantOrganizationId] = smartCase(applicantName);
    }
  );

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
      reportStatus,
      startDate,
    }) => {
      const countyIndex = getCountyIndex(Number(locationCode));
      const curriculumIndex = sortedCurriculumIds.indexOf(coursePlanId);
      const organizerIndex = sortedOrganizerIds.indexOf(
        applicantOrganizationId
      );

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
        organizerIndex,
        reportSchema: reportSchema && !reportStatus,
        reportStatus,
        startDate: stripISODate(startDate),
      };
    }
  );

  console.log("\x1b[1mOK\x1b[0m");
  return {
    counties,
    countyParams,
    curriculums,
    organizers,
    items,
    reportSchema,
  };
};

async function main() {
  console.log(`I like to ...`);

  await Promise.all(
    settings.tenants.map(async (tenant) => {
      const today = new Date();
      const currYear = today.getFullYear();
      const years = [currYear, currYear + 1];
      if (today.getMonth() < LAST_YEAR_UNTIL_MONTH) years.unshift(currYear - 1);

      await Promise.all(
        years.map(async (year) => {
          const data = await getData(tenant, year);
          const filepath = `data/${tenant.dataTarget}/${year}.json`;
          if (data.items.length) {
            process.stdout.write(`- Lagrer ${filepath} ... `);
            const wstream = fs.createWriteStream(filepath);
            wstream.write(JSON.stringify(data));
            wstream.end();
            console.log("\x1b[1mOK\x1b[0m");
          } else {
            if (fs.existsSync(filepath)) {
              process.stdout.write(
                `- Sletter ${reportSchema} (ingen kurs) ... `
              );
              fs.unlinkSync(filepath);
              console.log("\x1b[1mOK\x1b[0m");
            }
          }
        })
      );
    })
  );

  console.log(`... move it!`);
}

main();
