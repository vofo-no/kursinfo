"use strict";
const klass = require("./klass");
const han = require("./han");
const luke = require("./luke");
const aNames = require("../data/names/associations.json");

console.log(`               __
              / _)
     _.----._/ /  
    /         /   Vofo
 __/ (  | (  |    \x1b[1mRapportgenerator\x1b[0m
/__.-'|_|--|_|    \x1b[2m$ yarn run chewie [year]\x1b[0m
`);

const year = process.argv[2];

if (!year || !year.match(/^\d{4}$/)) {
  console.log("Du må oppgi et årstall.");
  return;
}

async function main() {
  const config = luke.getConfig(year);
  const data = luke.getData(year);
  const municipalities = await klass.getData(year);
  const dataHistory = luke.getDataHistory(year);

  process.stdout.write(`Analyserer... `);

  const reports = {};
  const regions = [];
  const associations = [];

  const makeRegStat = (k) => {
    const ks = config.regions[k];
    const ksFilter = (value) => ks.includes(Math.floor(value / 100));
    const ksRowFilter = (row) => ksFilter(row[han.COL.MUNICIPALITY]);
    const kData = data.filter(ksRowFilter);
    const kDataHistory = dataHistory.map((item) => item.filter(ksRowFilter));
    const kMunicipalities = Object.keys(municipalities).filter(ksFilter);

    const assocSummary = han.associationSummer(kData, kDataHistory[0]);
    const subjectSums = han.subjectSums(kData);

    const paramName = luke.parameterize(k);
    regions.push(paramName);
    reports[paramName] = {
      name: k,
      type: "REGION",
      isFuture: config.futureRegions.includes(k),
      courses: kData.length,
      facilitated: han.facilitated(kData),
      hours: han.sumHours(kData),
      historical: han.historical([kData, ...kDataHistory]),
      historicalAll: han.historical([data, ...dataHistory]),
      participants: han.participantsWithHistory([kData, ...kDataHistory]),
      municipalities: kMunicipalities,
      municipalityValues: han.getCompactMunicipalityData(kData, municipalities),
      organizations: han.countOrganizations(kData),
      population: kMunicipalities.reduce(
        (acc, key) => acc + municipalities[key].pop,
        0
      ),
      associations: config.associations.reduce((obj, key) => {
        obj[key] = assocSummary(key);
        return obj;
      }, {}),
      subjects: subjectSums,
      topSubjects: han.topAges(subjectSums),
      mainSubjects: han.mainSubjectSums(kData),
    };
  };

  Object.keys(config.regions).map(makeRegStat);

  const makeComboStat = (k) => {
    const cKeys = config.combos[k];
    const cFilter = (value) => cKeys.includes(value);
    const cRowFilter = (row) => cFilter(row[han.COL.ASSOCIATION]);
    const cData = data.filter(cRowFilter);
    const cDataHistory = dataHistory.map((yearData) =>
      yearData.filter(cRowFilter)
    );

    const assocSummary = han.associationSummer(cData, cDataHistory[0]);
    const subjectSums = han.subjectSums(cData);

    const paramName = luke.parameterize(k);
    reports[paramName] = {
      name: k,
      type: "TOTAL",
      key: cKeys.map(String),
      courses: cData.length,
      facilitated: han.facilitated(cData),
      hours: han.sumHours(cData),
      historical: han.historical([cData, ...cDataHistory]),
      participants: han.participantsWithHistory([cData, ...cDataHistory]),
      municipalityValues: han.getCompactMunicipalityData(cData, municipalities),
      organizations: han.countOrganizations(cData),
      associations: config.associations.reduce((obj, key) => {
        obj[key] = assocSummary(key);
        return obj;
      }, {}),
      subjects: subjectSums,
      topSubjects: han.topAges(subjectSums),
      mainSubjects: han.mainSubjectSums(cData),
    };
  };

  config.combos && Object.keys(config.combos).map(makeComboStat);

  const makeAssociationStat = (a) => {
    const aFilter = (value) => value === a;
    const aRowFilter = (row) => aFilter(row[han.COL.ASSOCIATION]);
    const aData = data.filter(aRowFilter);
    const aDataHistory = dataHistory.map((yearData) =>
      yearData.filter(aRowFilter)
    );

    const orgSummary = han.organizationSummer(aData, aDataHistory[0]);
    const subjectSums = han.subjectSums(aData);

    const orgs = Array.from(
      new Set(
        [...aData, ...(aDataHistory[0] || [])].map(
          (row) => row[han.COL.ORGANIZATION]
        )
      )
    );

    const paramName = luke.parameterize(aNames[String(a)].short);
    associations.push(paramName);
    reports[paramName] = {
      name: aNames[String(a)].name,
      type: "ASSOCIATION",
      key: String(a),
      courses: aData.length,
      facilitated: han.facilitated(aData),
      hours: han.sumHours(aData),
      historical: han.historical([aData, ...aDataHistory]),
      historicalAll: han.historical([data, ...dataHistory]),
      participants: han.participantsWithHistory([aData, ...aDataHistory]),
      municipalityValues: han.getCompactMunicipalityData(aData, municipalities),
      organizations: han.countOrganizations(aData),
      associations: orgs.reduce((obj, key) => {
        obj[key] = orgSummary(key);
        return obj;
      }, {}),
      subjects: subjectSums,
      topSubjects: han.topAges(subjectSums),
      mainSubjects: han.mainSubjectSums(aData),
    };
  };

  config.associations.map(makeAssociationStat);

  console.log("\x1b[1mOK\x1b[0m");

  // Save results
  luke.useTheForce(year, { municipalities, reports, regions, associations });
}

main();
