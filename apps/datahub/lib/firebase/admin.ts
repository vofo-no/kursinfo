import "server-only";

import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

import { getTeachersDataUrl } from "@/lib/utils";

import { clientConfig } from "./config.client";
import { serverConfig } from "./config.server";

function initializeApp() {
  return admin.initializeApp({
    credential: admin.credential.cert(serverConfig.serviceAccount),
    storageBucket: clientConfig.storageBucket,
  });
}

function getFirebaseAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  return initializeApp();
}

export function getFirebaseAdminStorage() {
  return getStorage(getFirebaseAdminApp());
}

function getFirebaseAdminFirestore() {
  return getFirestore(getFirebaseAdminApp());
}

export async function setUserScopeClaimByIdToken(idToken: string) {
  const claims = await getAuth().verifyIdToken(idToken, true);

  if (typeof claims.email !== "undefined") {
    return setUserScopeClaimByUid(claims.sub, claims.scope);
  }

  throw new Error("Not allowed");
}

async function setUserScopeClaimByUid(uid: string, currentScope?: string) {
  const db = getFirebaseAdminFirestore();
  const userRef = db.doc(["users", uid].join("/"));
  const userDoc = await userRef.get();

  const { scopes, scopeIndex } = (userDoc.data() || {}) as {
    scopes?: string[];
    scopeIndex?: number;
  };

  const scope = (scopes?.length && scopes[scopeIndex || 0]) || null;

  if (scope !== currentScope) {
    await getAuth().setCustomUserClaims(uid, {
      scope,
    });
  }
}

export function putFileForTenant(
  tenantId: string,
  year: number,
  month: number,
  content: string,
) {
  const fileUrl = getTeachersDataUrl(tenantId, year, month);

  if (!/^25\d\d\/\d{4}\-\d{2}\.json$/.test(fileUrl) || !content)
    throw "Argument error";

  const storage = getFirebaseAdminStorage();
  const file = storage.bucket().file(fileUrl);

  file.save(content, {
    contentType: "application/json",
    metadata: {
      owner: tenantId,
    },
  });

  return file.name;
}
