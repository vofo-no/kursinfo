"use server";

import { cookies, headers } from "next/headers";
import { refreshServerCookies } from "next-firebase-auth-edge/lib/next/cookies";

import { refreshCurrentUserScopeClaim } from "@/lib/firebase/admin";
import { clientConfig } from "@/lib/firebase/config.client";
import { serverConfig } from "@/lib/firebase/config.server";

export async function updateClaim() {
  const result = await refreshCurrentUserScopeClaim();
  if (result.updatedClaims) {
    await refreshServerCookies(cookies(), new Headers(headers()), {
      apiKey: clientConfig.apiKey,
      cookieName: serverConfig.cookieName,
      cookieSerializeOptions: serverConfig.cookieSerializeOptions,
      cookieSignatureKeys: serverConfig.cookieSignatureKeys,
      serviceAccount: serverConfig.serviceAccount,
    });
  }
}
