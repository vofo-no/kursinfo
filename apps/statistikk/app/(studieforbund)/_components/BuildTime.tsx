import getTenantData from "@/lib/getTenantData";
import intl from "@/lib/intl";

async function getBuildTime(tenant: string, year: string) {
  const { buildTime } = (await getTenantData(tenant, year)) || {};

  return buildTime;
}

interface Props {
  tenant: string;
  year: string;
}

export default async function BuildTime({ tenant, year }: Props) {
  const buildTime = await getBuildTime(tenant, year);

  if (!buildTime) return "";

  return (
    <>
      Sist oppdatert{" "}
      {intl.formatDate(Date.parse(buildTime), {
        timeStyle: "short",
        dateStyle: "medium",
        timeZone: "Europe/Oslo",
      })}
    </>
  );
}
