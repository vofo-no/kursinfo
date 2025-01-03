import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import { clientConfig } from "./config.client";

const firebaseApp =
  getApps().length === 0 ? initializeApp(clientConfig) : getApps()[0];
export const auth = getAuth(firebaseApp);
export const storage = getStorage(firebaseApp);
export const db = getFirestore(firebaseApp);
