import getTenantDataCached from "@/lib/get-tenant-data-cached";
import { formatBuildDateTime } from "@/lib/intl";

async function getBuildTime(tenant: string, year: string) {
  const { buildTime } = (await getTenantDataCached(tenant, year)) || {};

  return buildTime;
}

interface Props {
  tenant: string;
  year: string;
}

export default async function BuildTime({ tenant, year }: Props) {
  const buildTime = await getBuildTime(tenant, year);

  if (!buildTime) return "";

  return <>Sist oppdatert {formatBuildDateTime(Date.parse(buildTime))}</>;
}
