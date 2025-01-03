import { Dispatch } from "react";
import {
  doc,
  Firestore,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "./clientApp";

export interface DbUserRecord {
  currentScope?: string;
  scopes?: string[];
}

export async function getUserRecordByUid(db: Firestore, uid: string) {
  if (!uid) {
    console.log("Invalid uid");
    return;
  }

  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.data() as DbUserRecord;
}

export function getUserRecordSnapshopByUid(
  uid: string,
  cb: Dispatch<DbUserRecord>,
) {
  if (!uid) {
    console.log("Invalid uid");
    return;
  }

  if (typeof cb !== "function") {
    console.log("Error: The callback parameter is not a function");
    return;
  }

  const docRef = doc(db, "users", uid);
  const unsubscribe = onSnapshot(docRef, (docSnap) => {
    cb(docSnap.data() as DbUserRecord);
  });
  return unsubscribe;
}

export async function setScopeOnUserRecordByUid(
  uid: string,
  nextScope?: string,
) {
  if (!uid) {
    console.log("Invalid uid");
    return;
  }

  const docRef = doc(db, "users", uid);
  return updateDoc(docRef, { currentScope: nextScope });
}
