import getDefaultParams from "lib/getDefaultParams";
import { redirect } from "next/navigation";

import getHref from "../_helpers/getHref";
import { StudieforbundParams } from "../types";

export function redirectRoute(
  tenant: string,
  pathname: string,
  params: Partial<StudieforbundParams>,
) {
  const defaultParams = getDefaultParams({ ...params, tenant });
  const prefix = pathname.split("/", 2)[1] || "";
  redirect(getHref(prefix, defaultParams, {}));
}
