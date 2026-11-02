import { cacheLife, cacheTag } from "next/cache";
import {
  getCounties,
  getOrganizations,
  getTeachersMatchingQuery,
} from "@kursinfo/db";

import type { TeacherData } from "@/components/teacher-item";

export async function getFilterOptions(sf: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("teachers", `teachers:${sf}`);
  const [counties, organizations] = await Promise.all([
    getCounties(sf),
    getOrganizations(sf),
  ]);
  return { counties, organizations };
}

export async function searchTeachers(
  sf: string,
  filters: { query?: string; county: string[]; organization: string[] },
): Promise<TeacherData[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("teachers", `teachers:${sf}`);

  const rows = await getTeachersMatchingQuery(sf, filters);

  // group by teacher: return only what the UI needs, as plain objects
  const byTeacher = new Map<string, TeacherData>();
  for (const { teachers, courses } of rows) {
    let entry = byTeacher.get(teachers.id);
    if (!entry) {
      entry = {
        id: teachers.id,
        name: teachers.name,
        courses: [],
        studieplans: [],
      };
      byTeacher.set(teachers.id, entry);
    }
    entry.courses.push({
      id: String(courses.id),
      name: courses.title,
      date: courses.date,
      organizer: courses.organizer,
      curriculum: courses.curriculum,
      county: courses.county,
    });
    if (
      courses.curriculum &&
      !entry.studieplans!.includes(courses.curriculum)
    ) {
      entry.studieplans!.push(courses.curriculum);
    }
  }
  return [...byTeacher.values()];
}
