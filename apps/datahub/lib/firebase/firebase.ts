import { getApp, getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  inMemoryPersistence,
  setPersistence,
} from "firebase/auth";

import { getOrInitializeAppCheck } from "./app-check";
import { clientConfig } from "./config.client";

export interface DbUserRecord {
  currentScope?: string;
  scopes?: string[];
  readonly uid: string;
}

export const getFirebaseApp = () => {
  if (getApps().length) {
    return getApp();
  }

  const app = initializeApp(clientConfig);

  if (process.env.NEXT_PUBLIC_FIREBASE_APP_CHECK_KEY) {
    getOrInitializeAppCheck(app);
  }

  return app;
};

export function getFirebaseAuth() {
  const auth = getAuth(getFirebaseApp());

  setPersistence(auth, inMemoryPersistence);

  if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (auth as unknown as any)._canInitEmulator = true;
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_EMULATOR_HOST, {
      disableWarnings: true,
    });
  }

  return auth;
}
