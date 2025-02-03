import "server-only";

import { cookies, headers } from "next/headers";
import { getTokens } from "next-firebase-auth-edge";

import { authConfig } from "./firebase/config.server";

export async function getTokensFromCookies() {
  return await getTokens(await cookies(), {
    ...authConfig,
    headers: await headers(),
  });
}
