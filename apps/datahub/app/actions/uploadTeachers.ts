"use server";

import { getStorage, ref, uploadString } from "firebase/storage";

import { getAuthenticatedAppForUser } from "@/lib/firebase/serverApp";
import { getTeachersDataUrl } from "@/lib/teachers";

import { Teacher } from "../types";

export async function uploadTeachers(key: string, teachers: Teacher[]) {
  const [year, month] = key.split("-").map(Number);
  if (year < 2020 || year > new Date().getFullYear()) throw "Invalid year arg";
  if (month < 1 || month > 12) throw "Invalid month arg";

  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();

  if (currentUser && currentUser.customClaims.scope) {
    const s = getStorage(firebaseServerApp);

    const pathReference = ref(
      s,
      getTeachersDataUrl(currentUser.customClaims.scope, year, month),
    );

    await uploadString(pathReference, JSON.stringify(teachers), "raw", {
      contentType: "application/json",
      customMetadata: {
        teachers: String(teachers.length),
      },
    });
  } else {
    throw "Not allowed";
  }
}
