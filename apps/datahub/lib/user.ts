import { UserInfo } from "firebase/auth";
import { Tokens } from "next-firebase-auth-edge";
import { filterStandardClaims } from "next-firebase-auth-edge/lib/auth/claims";

import { DbUserRecord } from "@/lib/firebase/firebase";

export interface User extends UserInfo, DbUserRecord {
  idToken: string;
  customToken?: string;
  emailVerified: boolean;
  customClaims: {
    scope?: string;
    [key: string]: unknown;
  };
}

export const toUser = (
  { token, customToken, decodedToken }: Tokens,
  userRecord?: DbUserRecord | null,
): User => {
  const {
    uid,
    email,
    picture: photoURL,
    email_verified: emailVerified,
    phone_number: phoneNumber,
    name: displayName,
    source_sign_in_provider: signInProvider,
  } = decodedToken;

  const customClaims = filterStandardClaims(decodedToken);

  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    phoneNumber: phoneNumber ?? null,
    emailVerified: emailVerified ?? false,
    providerId: signInProvider,
    customClaims,
    idToken: token,
    customToken,
    currentScope: userRecord?.currentScope,
    scopes: userRecord?.scopes,
  };
};
