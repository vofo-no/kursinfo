"use strict";
const klass = require("./klass");
const han = require("./han");
const luke = require("./luke");
const Storage = require("./r2");
const aNames = require("../data/names/associations.json");
const chalk = require("chalk");

console.log(`               __
              / _)
     _.----._/ /  
    /         /   Vofo
 __/ (  | (  |    \x1b[1mRapportgenerator\x1b[0m
/__.-'|_|--|_|    \x1b[2m$ yarn run chewie [year]\x1b[0m
`);

const year = process.argv[2];

if (!year || !year.match(/^\d{4}$/)) {
  console.log(chalk.red("Du må oppgi et årstall."));
  process.exit();
}

async function main() {
  const config = luke.getConfig(year);
  const data = luke.getData(year);
  const municipalities = await klass.getData(year);
  const dataHistory = luke.getDataHistory(year);

  process.stdout.write(`Analyserer... `);

  const r2 = new Storage();

  /**
   * @param {string} key
   * @param {import("../types/reports").AnyReportType} type
   * @param {(item: unknown) => boolean} datafilter
   * @param {*} param3
   */
  const makeStat = (
    key,
    type,
    datafilter,
    {
      makeName = (name) => String(name),
      makeParam = luke.parameterize,
      municipalityKeys = [],
    } = {},
  ) => {
    const dataSet = data.filter(datafilter);
    const dataSetHistory = dataHistory.map((dataHistoryYear) =>
      dataHistoryYear.filter(datafilter),
    );

    const assocSummary = han.associationSummer(dataSet, dataSetHistory[0]);
    const orgSummary = han.organizationSummer(dataSet, dataSetHistory[0]);
    const subjectSums = han.subjectSums(dataSet);

    const paramName = makeParam(key);

    const addParticipantHistogram = Number(year) >= 2021;

    const reportData = {
      name: makeName(key),
      courses: dataSet.length,
      facilitated: han.facilitated(dataSet),
      hours: han.sumHours(dataSet),
      historical: han.historical([dataSet, ...dataSetHistory]),
      participants: han.participantsWithHistory([dataSet, ...dataSetHistory]),
      municipalityValues: han.getCompactMunicipalityData(
        dataSet,
        municipalities,
      ),
      organizations: han.countOrganizations(dataSet),
      associations: config.associations.reduce((obj, key) => {
        obj[key] = assocSummary(key);
        return obj;
      }, {}),
      subjects: subjectSums,
      topSubjects: han.topAges(subjectSums),
      mainSubjects: han.mainSubjectSums(dataSet),
      participantsHistogram: addParticipantHistogram
        ? han.participantsHistogram(dataSet, dataSetHistory[0])
        : undefined,
      participantsHistogramSums: addParticipantHistogram
        ? han.participantsHistogramSums(dataSet)
        : undefined,
    };

    switch (type) {
      case "REGION": {
        r2.setRegionReport(paramName, {
          ...reportData,
          key,
          type,
          isFuture: !!config.futureRegions?.includes(key),
          municipalities: municipalityKeys,
          population: municipalityKeys.reduce(
            (acc, key) => acc + municipalities[key].pop,
            0,
          ),
          historicalAll: han.historical([data, ...dataHistory]),
        });
        break;
      }
      case "ASSOCIATION": {
        const orgs = Array.from(
          new Set(
            [...dataSet, ...(dataSetHistory[0] || [])].map(
              (row) => row[han.COL.ORGANIZATION],
            ),
          ),
        );

        r2.setAssociationReport(paramName, {
          ...reportData,
          key,
          type,
          historicalAll: han.historical([data, ...dataHistory]),
          associations: orgs.reduce((obj, key) => {
            obj[key] = orgSummary(key);
            return obj;
          }, {}),
        });
        break;
      }
      case "COMBO": {
        const keys = config.combos[key];

        r2.setTotalReport(paramName, {
          ...reportData,
          type,
          keys: keys.map(String),
          historicalAll: han.historical([data, ...dataHistory]),
        });
        break;
      }
      case "GLOBAL": {
        r2.setGlobalReport(paramName, {
          ...reportData,
          type,
          key,
        });
        break;
      }
    }
  };

  makeStat("all", "GLOBAL", () => true, {
    makeName: () => "Hele landet",
  });

  const makeRegStat = (k) => {
    const ks = config.regions[k];
    const ksFilter = (value) =>
      ks.includes(Math.floor(value / 100)) || ks.includes(Number(value));
    const ksRowFilter = (row) => ksFilter(row[han.COL.MUNICIPALITY]);
    const municipalityKeys = Object.keys(municipalities).filter(ksFilter);

    makeStat(k, "REGION", ksRowFilter, { municipalityKeys });
  };

  Object.keys(config.regions).map(makeRegStat);

  const makeComboStat = (k) => {
    const cKeys = config.combos[k];
    const cFilter = (value) => cKeys.includes(value);
    const cRowFilter = (row) => cFilter(row[han.COL.ASSOCIATION]);

    makeStat(k, "COMBO", cRowFilter);
  };

  config.combos && Object.keys(config.combos).map(makeComboStat);

  const makeAssociationStat = (a) => {
    const aFilter = (value) => value === a;
    const aRowFilter = (row) => aFilter(row[han.COL.ASSOCIATION]);

    makeStat(a, "ASSOCIATION", aRowFilter, {
      makeName: (a) => aNames[String(a)].name,
      makeParam: (a) => luke.parameterize(aNames[String(a)].short),
    });
  };

  config.associations.map(makeAssociationStat);

  console.log("\x1b[1mOK\x1b[0m");

  let extinfo = {};

  // Add optional source
  if (config.dataSource) {
    extinfo["source"] = config.dataSource;
  }

  // Save results
  luke.useTheForce(year, { municipalities, ...r2.data(), ...extinfo });
}

main();
