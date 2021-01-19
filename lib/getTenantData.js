const fs = require("fs");
const path = require("path");

function getTenantData(tenant, year) {
  const dataPath = path.join(process.cwd(), `data/${tenant}/${year}.json`);
  return JSON.parse(fs.readFileSync(dataPath, "utf-8"));
}

module.exports = getTenantData;
