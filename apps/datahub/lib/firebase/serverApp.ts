import "server-only";

import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { clientConfig } from "./config.client";
import { getTokensFromCookies, tokensToUser } from "./get-tokens.server";

export async function getAuthenticatedAppForUser() {
  const tokens = await getTokensFromCookies();

  const firebaseServerApp = initializeServerApp(
    clientConfig,
    tokens
      ? {
          authIdToken: tokens.token,
        }
      : {},
  );

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return {
    firebaseServerApp,
    currentUser: tokens ? tokensToUser(tokens) : null,
  };
}
