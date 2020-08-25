"use strict";
const klass = require("./klass");
const han = require("./han");
const luke = require("./luke");

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

  let reports = {};

  const makeStat = (k) => {
    const ks = config.regions[k];
    const ksFilter = (row) => ks.includes(Math.floor(row[2] / 100));
    const kData = data.filter(ksFilter);
    const kDataHistory = Object.keys(dataHistory).map((key) =>
      dataHistory[key].filter(ksFilter)
    );
    const kMunicipalities = Object.keys(municipalities).filter((key) =>
      ks.includes(Math.floor(key / 100))
    );

    const assocSummary = han.associationSummer(kData, kDataHistory[0]);
    const subjectSums = han.subjectSums(kData);

    reports[luke.parameterize(k)] = {
      name: k,
      isFuture: config.futureRegions.includes(k),
      courses: kData.length,
      facilitated: han.facilitated(kData),
      hours: han.sumHours(kData),
      historical: han.historical([kData, ...kDataHistory]),
      historicalAll: han.historical([data, ...Object.values(dataHistory)]),
      participants: han.participantsWithHistory([
        kData,
        ...Object.values(kDataHistory),
      ]),
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

  Object.keys(config.regions).map(makeStat);
  console.log("\x1b[1mOK\x1b[0m");

  // Save results
  luke.useTheForce(year, { municipalities, reports });
}

main();
