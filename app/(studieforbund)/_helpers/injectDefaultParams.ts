import getDefaultParams from "lib/getDefaultParams";

import { StudieforbundParams } from "../types";

export default function injectDefaultParams(
  params: Partial<StudieforbundParams> | null,
): StudieforbundParams {
  return getDefaultParams(params || {});
}
