import getTenantData from "lib/getTenantData";
import intl from "lib/intl";
import { cache } from "react";

const getBuildTime = cache((tenant: string, year: string) => {
  const { buildTime } = getTenantData(tenant, year);

  return buildTime;
});

interface Props {
  tenant: string;
  year: string;
}

export default function BuildTime({ tenant, year }: Props) {
  const buildTime = getBuildTime(tenant, year);

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
