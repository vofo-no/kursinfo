import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import {
  afterMaxLastYear,
  isValidTarget,
  updateStatistics,
} from "@kursinfo/julien";

export const maxDuration = 60;

const yearRegExp = /^20\d\d$/;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const searchParams = request.nextUrl.searchParams;

  const target = searchParams.get("target");

  if (!target || !isValidTarget(target)) {
    return new Response("Not valid target", { status: 400 });
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  let years = [currentYear, currentYear + (afterMaxLastYear() ? 1 : -1)].map(
    String,
  );

  const overrideYear = searchParams.get("year");
  
  if (overrideYear && yearRexExp.test(overrideYear) && Number(overrideYear) <= currentYear + 1) {
    years = [overrideYear]
  }

  await updateStatistics([target], years, (sf, year) => {
    revalidateTag(`sf:${sf}:${year}`);
  });

  return new Response("Success", { status: 200 });
}
