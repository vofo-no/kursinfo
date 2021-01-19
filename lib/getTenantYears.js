const fs = require("fs");
const path = require("path");

function getTenantYears(tenant) {
  const years = [];
  const dataDir = path.join(process.cwd(), `data/${tenant}`);
  fs.readdirSync(dataDir).map((file) => {
    if (file.match(/^\d+\.json$/)) {
      years.push(file.split(".")[0]);
    }
  });

  return years;
}

module.exports = getTenantYears;
