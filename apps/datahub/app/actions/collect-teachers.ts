"use server";

import { getDownloadURL, ref, uploadString } from "firebase/storage";

import { getServerFirebaseServices } from "@/lib/firebase/firebase.server";
import { mergeTeachers } from "@/lib/teachers";

import { Teacher } from "../types";

export async function collectTeachers(
  scope: string,
  year: string,
  tasks: { taskId: string; teachers: Teacher[] }[],
) {
  const { storage } = await getServerFirebaseServices();

  const today = new Date();
  const maxMonth = Number(year) < today.getFullYear() ? 12 : today.getMonth();
  const allKeys: string[] = [];

  for (let m = 1; m <= maxMonth; m++) {
    allKeys.push(`${year}-${m.toString().padStart(2, "0")}`);
  }

  const teachers = await Promise.all(
    allKeys.map(async (key): Promise<Teacher[]> => {
      const prefetched = tasks.find((task) => task.taskId === key);

      if (prefetched) return prefetched.teachers;

      const fileRef = ref(storage, `${scope}/${key}.json`);

      try {
        const url = await getDownloadURL(fileRef);
        return (await fetch(url)).json();
      } catch {
        return [];
      }
    }),
  ).then((r) => mergeTeachers(r.flat()));

  const pathReference = ref(storage, `${scope}/${year}.json`);

  await uploadString(pathReference, JSON.stringify(teachers), "raw", {
    contentType: "application/json",
    customMetadata: {
      teachers: String(teachers.length),
    },
  });
}
