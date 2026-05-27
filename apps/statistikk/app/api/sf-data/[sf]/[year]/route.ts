import { NextRequest } from "next/server";

import { getTenantData } from "@/lib/get-tenant-data";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/sf-data/[sf]/[year]">,
) {
  const { sf, year } = await ctx.params;
  const sfData = await getTenantData(sf, year);
  return Response.json(sfData);
}
