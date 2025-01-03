import "server-only";

import {
  getTokensFromCookies,
  tokensToUser,
} from "@/lib/firebase/get-tokens.server";

export async function userFromCookies() {
  const tokens = await getTokensFromCookies();
  return tokens ? tokensToUser(tokens) : null;
}
