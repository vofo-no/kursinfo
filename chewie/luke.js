const Papa = require("papaparse");
const fs = require("fs");
const mainDataIndex = require("../data/index.json");

const MAX_HISTORY_YEARS = 5;
const PATH_REGEX = /[^a-z0-9æøå\s\-]/g;

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

const getDataHistory = (year) => {
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

  return dataHistory;
};

function parameterize(str) {
  return str
    .toLowerCase()
    .replace(PATH_REGEX, "")
    .replace(/\s+/g, "-")
    .replace(/\-+/g, "-")
    .replace(/[æå]/g, "a")
    .replace(/ø/g, "o");
}

const useTheForce = (year, content) => {
  process.stdout.write(`Lagrer resultater... `);
  const wstream = fs.createWriteStream(`data/${year}.json`);
  wstream.write(JSON.stringify(content));
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
};

module.exports = {
  getConfig,
  getData,
  getDataHistory,
  parameterize,
  useTheForce,
};
