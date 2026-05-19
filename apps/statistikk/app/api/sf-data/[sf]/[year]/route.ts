import { NextRequest } from "next/server";

import getTenantDataCached from "@/lib/get-tenant-data-cached";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/sf-data/[sf]/[year]">,
) {
  const { sf, year } = await ctx.params;
  const sfData = await getTenantDataCached(sf, year);
  return Response.json(sfData);
}
