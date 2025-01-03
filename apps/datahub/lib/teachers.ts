import { Teacher } from "@/app/types";

import { arrUnique } from "./utils";

export function mergeTeachers(teachers: Teacher[]): Teacher[] {
  const map = new Map<string | undefined, Teacher>();

  teachers.forEach((item) => {
    const currItem = map.get(item.id);
    map.set(
      item.id,
      currItem
        ? {
            ...currItem,
            courses: arrUnique(currItem.courses.concat(item.courses)),
            subjects: arrUnique(currItem.subjects.concat(item.subjects)),
          }
        : item,
    );
  });

  return Array.from(map.values());
}

export function getTeachersDataUrl(
  scope: string,
  year: number,
  month?: number,
) {
  return `${scope}/${year}-${String(month).padStart(2, "0")}.json`;
}
