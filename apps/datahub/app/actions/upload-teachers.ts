"use server";

import { ref, uploadString } from "firebase/storage";

import { getServerFirebaseServices } from "@/lib/firebase/firebase.server";
import { getTeachersDataUrl } from "@/lib/teachers";

import { Teacher } from "../types";

export async function uploadTeachers(
  scope: string,
  key: string,
  teachers: Teacher[],
) {
  const [year, month] = key.split("-").map(Number);
  if (year < 2020 || year > new Date().getFullYear()) throw "Invalid year arg";
  if (month < 1 || month > 12) throw "Invalid month arg";

  const { storage } = await getServerFirebaseServices();

  const pathReference = ref(storage, getTeachersDataUrl(scope, year, month));

  await uploadString(pathReference, JSON.stringify(teachers), "raw", {
    contentType: "application/json",
    customMetadata: {
      teachers: String(teachers.length),
    },
  });
}
