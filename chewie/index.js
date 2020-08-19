"use strict";
const Papa = require("papaparse");
const fs = require("fs");
const klass = require("./klass");
const han = require("./han");
const luke = require("./luke");

const mainDataIndex = require("../data/index.json");

const MAX_HISTORY_YEARS = 5;

const getConfig = (year) => {
  process.stdout.write(`Laster konfigurasjon for ${year}... `);

  const config = JSON.parse(fs.readFileSync(`data/config.json`, "utf-8"));
  const years = Object.keys(config).sort().reverse();

  const result = config[years.find((y) => y <= year)];

  if (!result) {
    console.log("\x1b[31m\x1b[1mFeil\x1b[0m");
    console.log("Finner ingen konfigurasjon for dette året.");
    process.exit();
  }

  console.log("\x1b[1mOK\x1b[0m");

  return result;
};

const hasData = (year) => {
  return fs.existsSync(`data/raw/g${year}.csv`);
};

const getData = (year) => {
  process.stdout.write(`Laster data for ${year}... `);

  const localFile = fs.readFileSync(`data/raw/g${year}.csv`, "utf-8");
  const file = Papa.parse(localFile, { dynamicTyping: true });

  if (file.errors.length) {
    console.log("\x1b[31m\x1b[1mFeil\x1b[0m");
    console.log(file.errors);
    process.exit();
  }

  console.log("\x1b[1mOK\x1b[0m");

  const hours = file.data.reduce((acc, row) => acc + row[23], 0);

  console.log(
    "\x1b[2m",
    hours.toLocaleString().padStart(10, " "),
    "timer\x1b[0m"
  );
  console.log(
    "\x1b[2m",
    file.data.length.toLocaleString().padStart(10, " "),
    "kurs\x1b[0m"
  );

  return file.data;
};

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
  const config = getConfig(year);
  const data = getData(year);
  const municipalities = await klass.getData(year);

  console.log(`Ser etter historiske data ${MAX_HISTORY_YEARS} år tilbake... `);

  const dataHistory = {};
  for (
    let historyYear = year - 1;
    historyYear > year - MAX_HISTORY_YEARS;
    historyYear--
  ) {
    if (hasData(historyYear)) {
      dataHistory[historyYear] = getData(historyYear);
    } else {
      console.log(`Finner ikke data for ${historyYear}. `);
      break;
    }
  }

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

  process.stdout.write(`Lagrer resultater... `);
  const wstream = fs.createWriteStream(`data/${year}.json`);
  wstream.write(JSON.stringify({ municipalities, reports }));
  wstream.end();
  console.log("\x1b[1mOK\x1b[0m");

  // Append to main data index
  process.stdout.write(`Legger til ${year} i indeks... `);
  mainDataIndex.years = [...new Set([...mainDataIndex.years, year])]
    .sort()
    .reverse();

  const istream = fs.createWriteStream(`data/index.json`);
  istream.write(JSON.stringify(mainDataIndex));
  istream.end();
  console.log("\x1b[1mOK\x1b[0m");
}

main();
