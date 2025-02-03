import "server-only";

import { getFirebaseAuth } from "next-firebase-auth-edge";

import { authConfig } from "./config.server";
import { getServerUserRecord } from "./firebase.server";

const { setCustomUserClaims } = getFirebaseAuth({
  serviceAccount: authConfig.serviceAccount,
  apiKey: authConfig.apiKey,
  enableCustomToken: authConfig.enableCustomToken,
});

export async function setCurrentUserClaims() {
  const { scopes, currentScope, uid } = (await getServerUserRecord()) || {};

  if (scopes && currentScope && uid) {
    const scope = scopes.includes(currentScope) ? currentScope : undefined;
    await setCustomUserClaims(uid, { scope });
    return { updatedClaims: true };
  }

  return { updatedClaims: false };
}
