import { getToken } from "firebase/app-check";
import { UserCredential } from "firebase/auth";

import { getAppCheck } from "./app-check";

export async function login(token: string) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
    const appCheckTokenResponse = await getToken(getAppCheck(), false);

    headers["X-Firebase-AppCheck"] = appCheckTokenResponse.token;
  }

  await fetch("/api/login", {
    method: "GET",
    headers,
  });
}

export async function loginWithCredential(credential: UserCredential) {
  const idToken = await credential.user.getIdToken();

  await login(idToken);
}

export async function logout() {
  const headers: Record<string, string> = {};

  if (process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
    const appCheckTokenResponse = await getToken(getAppCheck(), false);

    headers["X-Firebase-AppCheck"] = appCheckTokenResponse.token;
  }

  await fetch("/api/logout", {
    method: "GET",
    headers,
  });
}
