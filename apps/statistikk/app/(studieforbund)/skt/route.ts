import { NextRequest } from "next/server";

import { redirectRoute } from "@/app/(studieforbund)/_utils/redirectRoute";
import { StudieforbundParams } from "@/app/(studieforbund)/types";

import { config } from "./config";

export async function GET(
  request: NextRequest,
  { params }: { params: Partial<StudieforbundParams> },
) {
  return redirectRoute(config.tenant, request.nextUrl.pathname, params);
}
