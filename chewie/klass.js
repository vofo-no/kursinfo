const https = require("https");
const url = "https://data.ssb.no/api/v0/no/table/07459";

const query = (year) => `
{
    "query": [
      {
        "code": "Region",
        "selection": {
          "filter": "all",
          "values": [
            "*"
          ]
        }
      },
      {
        "code": "Tid",
        "selection": {
          "filter": "item",
          "values": [
            "${year}"
          ]
        }
      }
    ],
    "response": {
      "format": "json-stat2"
    }
  }`;

const fetchFromSSB = (year) =>
  new Promise((resolve, reject) => {
    const req = https.request(url, { method: "POST" }, (res) => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", (data) => {
        body += data;
      });
      res.on("end", () => {
        body = JSON.parse(body);
        resolve(body);
      });
      res.on("error", (err) => reject(err));
    });

    req.write(query(year));
    req.end();
  });

const sanitizeName = (name) => name.replace(/\s\(\d*\-\d+\)$/, "");

const makeMunicipalityObject = (data) => {
  let result = {};

  Object.keys(data.dimension.Region.category.index).forEach((key) => {
    if (key.length === 4) {
      const index = data.dimension.Region.category.index[key];
      const pop = data.value[index];
      if (pop > 0) {
        result[key] = {
          name: sanitizeName(data.dimension.Region.category.label[key]),
          pop,
        };
      }
    }
  });

  return result;
};

const getData = async (year) => {
  process.stdout.write(`Henter kommunedata fra SSB for ${year}... `);

  const ssb = await fetchFromSSB(year);
  const municipalities = makeMunicipalityObject(ssb);

  console.log("\x1b[1mOK\x1b[0m");

  return municipalities;
};

module.exports = { getData };
