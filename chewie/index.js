"use strict";
const klass = require("./klass");
const han = require("./han");
const luke = require("./luke");
const aNames = require("../components/Associations/names.json");

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

  const municipalitySummary = han.municipalitySummer(data);

  Object.keys(municipalities).map((key) => {
    const nkey = Number(key);
    const m = municipalities[key];
    const mData = municipalitySummary(nkey);
    municipalities[key] = {
      ...m,
      ...mData,
      coursesPerCapita: mData.courses / m.pop,
    };
  });

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

  const makeAssociationStat = (a) => {
    const aFilter = (value) => value === a;
    const aRowFilter = (row) => aFilter(row[han.COL.ASSOCIATION]);
    const aData = data.filter(aRowFilter);
    const aDataHistory = dataHistory.map((yearData) =>
      yearData.filter(aRowFilter)
    );

    const subjectSums = han.subjectSums(aData);

    const paramName = luke.parameterize(aNames.short[String(a)]);
    associations.push(paramName);
    reports[paramName] = {
      name: aNames[String(a)],
      type: "ASSOCIATION",
      key: String(a),
      courses: aData.length,
      facilitated: han.facilitated(aData),
      hours: han.sumHours(aData),
      historical: han.historical([aData, ...aDataHistory]),
      historicalAll: han.historical([data, ...dataHistory]),
      participants: han.participantsWithHistory([aData, ...aDataHistory]),
      organizations: han.countOrganizations(aData),
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
