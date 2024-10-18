"use server";

import { setUserScopeClaimByIdToken } from "@/lib/firebase/admin";

export async function updateClaim(idToken: string) {
  setUserScopeClaimByIdToken(idToken);
}
