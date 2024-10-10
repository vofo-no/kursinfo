import { redirect } from "next/navigation";

import getDefaultParams from "@/lib/getDefaultParams";

import getHref from "../_helpers/getHref";
import { StudieforbundParams } from "../types";

export async function redirectRoute(
  tenant: string,
  pathname: string,
  params: Partial<StudieforbundParams>,
) {
  const defaultParams = await getDefaultParams({ ...params, tenant });
  const prefix = pathname.split("/", 2)[1] || "";
  redirect(getHref(prefix, defaultParams, {}));
}
