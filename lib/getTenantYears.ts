import { readdirSync } from "fs";
import { join } from "path";

function getTenantYears(tenant: string): Array<string> {
  const years: Array<string> = [];
  const dataDir = join(process.cwd(), `data/${tenant}`);
  readdirSync(dataDir).map((file) => {
    if (file.match(/^\d+\.json$/)) {
      years.push(file.split(".")[0]);
    }
  });

  return years;
}

export default getTenantYears;
