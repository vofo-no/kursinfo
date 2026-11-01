import { syncCoursesForMonth } from "../sync/sync";
import { type CourseSyncData, type Database } from "../sync/types";

export const baseCourse: CourseSyncData = {
  courseId: 1,
  title: "Pianokurs",
  curriculum: "Grunnleggende piano",
  organizer: "Oslo Musikklag",
  organization: "Noregs ungdomslag",
  county: "Oslo",
  date: "2026-03-10",
  scope: "s1",
  teacherId: "t1",
  teacherName: "Kari Nordmann",
};

// Seeds through the real sync, one call per scope+month.
// Use a single seed() call per test: seeding the same month again replaces it.
export async function seed(
  db: Database,
  ...overrides: Partial<CourseSyncData>[]
) {
  const groups = new Map<string, CourseSyncData[]>();
  overrides.forEach((o, i) => {
    const row = { ...baseCourse, courseId: i + 1, ...o };
    const key = `${row.scope}|${row.date.slice(0, 7)}`;
    groups.set(key, [...(groups.get(key) ?? []), row]);
  });

  for (const group of groups.values()) {
    const { scope, date } = group[0]!;
    const [year, month] = date.split("-").map(Number);
    await syncCoursesForMonth(db, scope, year!, month!, group);
  }
}
