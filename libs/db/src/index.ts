import { and, between, desc, eq, gte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import { courses, teachers } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

interface CourseSyncData {
  courseId: number;
  title: string;
  curriculum: string;
  organizer: string;
  county: string;
  date: string; // ISO date string
  scope: string;
  teacherId: string;
  teacherName: string;
}

export function syncCoursesForMonth(
  scope: string,
  year: number,
  month: number,
  syncData: CourseSyncData[],
) {
  // check that scope in syncData matches the provided scope
  for (const course of syncData) {
    if (course.scope !== scope) {
      throw new Error(`Scope mismatch: expected ${scope}, got ${course.scope}`);
    }
  }

  // prefix teacher IDs to avoid collisions between scopes
  for (const course of syncData) {
    course.teacherId = `${scope}-${course.teacherId}`;
  }

  // extract teacher data
  const teachersMap: Record<string, string> = {};
  for (const course of syncData) {
    teachersMap[course.teacherId] = course.teacherName;
  }

  const teachersData = Object.entries(teachersMap).map(([id, name]) => ({
    id,
    name,
  }));

  return db.transaction(async (tx) => {
    const monthStart = new Date(Date.UTC(year, month - 1, 1));
    const monthEnd = new Date(Date.UTC(year, month, 0));

    // clear existing courses for the month and scope
    await tx
      .delete(courses)
      .where(
        and(
          eq(courses.scope, scope),
          between(
            courses.date,
            monthStart.toISOString().substring(0, 10),
            monthEnd.toISOString().substring(0, 10),
          ),
        ),
      );

    // upsert teachers
    await tx.insert(teachers).values(teachersData).onConflictDoNothing();

    // insert new courses
    await tx.insert(courses).values(syncData);
  });
}

export async function getTeachersMatchingQuery(
  scope: string,
  query: string,
  yearsBack?: number,
  county?: string,
) {
  const conditions = [eq(courses.scope, scope)];
  if (yearsBack !== undefined) {
    const currentYear = new Date().getUTCFullYear();
    conditions.push(gte(courses.date, `${currentYear - yearsBack}-01-01`));
  }
  if (county !== undefined) {
    conditions.push(eq(courses.county, county));
  }

  return db
    .select()
    .from(courses)
    .innerJoin(teachers, eq(courses.teacherId, teachers.id))
    .where(
      and(
        ...conditions,
        sql`courses.content_search @@ plainto_tsquery('norwegian', ${query})`,
      ),
    )
    .orderBy(courses.teacherId, desc(courses.date));
}
