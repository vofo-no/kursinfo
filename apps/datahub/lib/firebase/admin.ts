import "server-only";

import admin from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase/firestore";

import { clientConfig } from "./config.client";
import { serverConfig } from "./config.server";
import { getUserRecordByUid } from "./firestore";
import { getAuthenticatedAppForUser } from "./serverApp";

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

function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export async function refreshCurrentUserScopeClaim() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  if (!currentUser) {
    throw new Error("Unauthenticated");
  }

  if (typeof currentUser.email === "undefined") {
    throw new Error("Not allowed");
  }

  const db = getFirestore(firebaseServerApp);
  const { scopes, currentScope } =
    (await getUserRecordByUid(db, currentUser.uid)) || {};

  if (scopes?.length) {
    const claimedScope =
      currentScope && scopes.includes(currentScope) ? currentScope : undefined;

    if (claimedScope !== currentUser.customClaims["scope"]) {
      const auth = getAdminAuth();
      await auth.setCustomUserClaims(currentUser.uid, {
        scope: claimedScope || null,
      });

      return { updatedClaims: true };
    }
  }

  return { updatedClaims: false };
}
