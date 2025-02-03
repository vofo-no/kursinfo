"use server";

import { setCurrentUserClaims } from "@/lib/firebase/admin";
import { updateServerUserRecord } from "@/lib/firebase/firebase.server";

import { refreshCookies } from "./refresh-cookies";

export async function updateClaim(nextScope?: string) {
  if (nextScope) await updateServerUserRecord(nextScope);

  const result = await setCurrentUserClaims();
  if (result.updatedClaims) await refreshCookies();
}
