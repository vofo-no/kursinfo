import "server-only";

import { initializeServerApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import {
  getDownloadURL,
  getMetadata,
  getStorage,
  list,
  ref,
} from "firebase/storage";

import { getTokensFromCookies } from "../get-tokens-from-cookies";
import { clientConfig } from "./config.client";
import { DbUserRecord } from "./firebase";

export async function getServerFirebaseServices() {
  const tokens = await getTokensFromCookies();

  const serverApp = initializeServerApp(
    clientConfig,
    tokens
      ? {
          authIdToken: tokens.token,
        }
      : {},
  );

  const auth = getAuth(serverApp);

  await auth.authStateReady();

  const db = getFirestore(serverApp);
  const storage = getStorage(serverApp);

  return { auth, db, storage };
}

export async function getServerUserRecord() {
  const { auth, db } = await getServerFirebaseServices();

  if (!auth.currentUser) return;

  const docRef = doc(db, "users", auth.currentUser.uid);

  const docSnap = await getDoc(docRef);
  return { ...docSnap.data(), uid: docSnap.id } as DbUserRecord;
}

export async function updateServerUserRecord(currentScope: string) {
  const { auth, db } = await getServerFirebaseServices();

  if (!auth.currentUser) return;

  const docRef = doc(db, "users", auth.currentUser.uid);

  return updateDoc(docRef, { currentScope });
}

export async function getServerDownloadUrl(file: string) {
  const { storage } = await getServerFirebaseServices();

  const pathReference = ref(storage, file);

  return getDownloadURL(pathReference);
}

export async function getServerListTeacherDatafiles(scope: string) {
  const { storage } = await getServerFirebaseServices();

  const pathReference = ref(storage, `${scope}/`);
  try {
    const files = await list(pathReference, { maxResults: 100 }).then(
      (result) =>
        Promise.all(
          result.items.map((item) =>
            getMetadata(item).then(
              ({ name, timeCreated, size, customMetadata }) => ({
                name,
                timeCreated,
                size,
                teachers: customMetadata?.teachers,
              }),
            ),
          ),
        ),
    );
    return files;
  } catch {
    return [];
  }
}
