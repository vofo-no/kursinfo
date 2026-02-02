import { NextRequest } from "next/server";

import { redirectRoute } from "@/app/(studieforbund)/_utils/redirectRoute";
import { StudieforbundParams } from "@/app/(studieforbund)/types";

import { config } from "./config";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<Partial<StudieforbundParams>> },
) {
  const params = await props.params;
  return redirectRoute(config.tenant, request.nextUrl.pathname, params);
}
