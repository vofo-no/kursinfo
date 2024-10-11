import { del, put } from "@vercel/blob";
import chalk from "chalk";
import { compress, trimUndefinedRecursively } from "compress-json";

import { adapters } from "./adapters";
import { getConfig } from "./config";
import { CourseStatuses } from "./constants";
import { getTenantSettings, hasTenant } from "./get-tenant-settings";
import { getCounties } from "./helpers/getCounties";
import { makeShortAggregate } from "./helpers/makeShortAggregate";
import { smartCase } from "./helpers/smartCase";
import { Adapter, IndexedCourseItem, ITenantData } from "./types";

export function isValidTarget(target: string) {
  return hasTenant(target);
}

export async function updateStatistics(
  targets?: string[],
  years?: string[],
  cb?: (target: string, year: string) => void,
) {
  const args = {
    targets: targets || [],
    years: years || [],
  };

  const programExecutionTimer = chalk.green(
    "✅ By the power vested in me, by the law of the jungle, blah, blah, blah, blah... Be gone!",
  );
  console.time(programExecutionTimer);

  console.log(
    chalk.blueBright(
      "🥥 [robot voice] I am very clever king... tok tok tok tok... I am super genius... I am robot king of the monkey thing... compute... compute.",
    ),
  );

  const tasks: Promise<void>[] = [];

  args.targets.map((sf) => {
    const tenant = getTenantSettings(sf);

    if (!tenant) {
      console.log(`Unknown tenant ${sf}. Skipping.`);
    } else {
      const adapterName = tenant.adapter;
      const adapter = adapters[adapterName];

      if (!adapter) {
        console.log(`Unknown adapter ${adapterName}. Skipping.`);
      } else {
        args.years.map((year) => {
          tasks.push(
            fetchTask({ tenant, year }, adapter).then(() => {
              if (typeof cb === "function") {
                cb(sf, year);
              }
            }),
          );
        });
      }
    }
  });

  await Promise.all(tasks);

  console.timeEnd(programExecutionTimer);
}

function stripISODate(raw: unknown) {
  if (typeof raw !== "string") return raw;
  return raw.split("T", 2)[0];
}

async function getData(
  tenant: {
    id: string;
    name: string;
    adapter: string;
    dataTarget: string;
    config?: {
      hidePlannedGrants?: boolean;
      reportSchema?: string;
      useTitleColumn?: boolean;
    };
  },
  year: string,
  adapter: Adapter,
): Promise<ITenantData> {
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

  const organizations: Array<string> = [];
  const organizationCodes: Set<string> = new Set();

  const organizerIds: Record<string, string> = {};
  const curriculumIds: Record<string, string> = {};

  const counties = countyData.map(({ region }) => region);
  const countyParams = countyData.map(({ param }) => param);

  /**
   *
   * @param {number} locationCode 3-4 digits municipality code
   * @returns {number} index for county in countyData, -1 otherwise
   */
  function getCountyIndex(locationCode: number): number {
    if (isNaN(locationCode)) return -1;
    const countyCode = Math.floor(locationCode / 100);
    return countyData.findIndex(({ keys }) => keys.has(countyCode));
  }

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

  const items: Array<IndexedCourseItem> = data.map((item) => {
    const countyIndex = getCountyIndex(Number(item.locationCode));
    const curriculumIndex = sortedCurriculumIds.indexOf(item.curriculumId);
    const organizerIndex = sortedOrganizerIds.indexOf(item.organizerId);

    item.startDate = stripISODate(item.startDate) as string;
    if (item.endDate) item.endDate = stripISODate(item.endDate) as string;

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

    if (item.hasTeacher === false) {
      delete item.hasTeacher;
    }

    const filterKeys = ["endDate", "grant", "hasTeacher"];

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
}

async function fetchTask(
  {
    tenant,
    year,
  }: {
    tenant: {
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
  },
  adapter: Adapter,
) {
  const outpath = `sf-data/v1/${tenant.dataTarget}/${year}.json`;

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
    const aggPath = `sf-data/v1/${tenant.dataTarget}-short.json`;
    console.log(`=> Lagrer sammendrag i [${chalk.blue(aggPath)}]...`);

    await put(aggPath, JSON.stringify(aggData), {
      access: "public",
      addRandomSuffix: false,
      cacheControlMaxAge: 43200, // 12 hours
    });
  }

  if (data.items.length) {
    console.log(`=> Lagrer data i [${chalk.blue(outpath)}]...`);
    trimUndefinedRecursively(data);
    await put(outpath, JSON.stringify(compress(data)), {
      access: "public",
      addRandomSuffix: false,
    });
  } else {
    console.log(`=> Sletter [${chalk.blue(outpath)}] (ingen kurs)...`);
    try {
      del(outpath);
    } catch (e) {
      const err = e as Error;
      console.log(`=> ${err.name}`);
    }
  }

  console.timeEnd(loopJobName);
}
