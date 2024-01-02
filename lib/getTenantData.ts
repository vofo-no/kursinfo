import { existsSync, readFileSync } from "fs";
import { notFound } from "next/navigation";
import { join } from "path";

import { ITenantData } from "../types/courses";

function getTenantData(tenant: string, year: string): ITenantData {
  const dataPath = join(process.cwd(), `data/${tenant}/${year}.json`);
  if (!existsSync(dataPath)) {
    notFound();
  }

  return JSON.parse(readFileSync(dataPath, "utf-8"));
}

export default getTenantData;
