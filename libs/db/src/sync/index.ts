import { and, between, countDistinct, eq, gte, min, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

import { courses, teachers } from "../schema";

export type Database = PgDatabase<PgQueryResultHKT>;

export interface CourseSyncData {
  courseId: number;
  title: string;
  curriculum: string;
  organization: string;
  organizer: string;
  county: string;
  date: string; // ISO date string
  scope: string;
  teacherId: string;
  teacherName: string;
}

export async function syncCoursesForMonth(
  db: Database,
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

  // prefix teacher id with scope
  const rows = syncData.map((c) => ({
    ...c,
    teacherId: `${scope}-${c.teacherId}`,
  }));

  const teachersMap = new Map(rows.map((r) => [r.teacherId, r.teacherName]));
  const teachersData = [...teachersMap].map(([id, name]) => ({ id, name }));

  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 0));

  await db.transaction(async (tx) => {
    // delete all courses in the given month and scope
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

    if (rows.length === 0) return;

    // upsert teachers
    await tx.insert(teachers).values(teachersData).onConflictDoNothing();

    // insert courses
    await tx.insert(courses).values(rows);
  });
}

export async function getSyncStatus(
  db: Database,
  scope: string,
): Promise<
  {
    month: string;
    teacherCount: number;
    syncedAt: Date | null;
  }[]
> {
  const results = await db
    .select({
      month: sql<string>`TO_CHAR(${courses.date}, 'YYYY-MM') AS month`,
      teacherCount: countDistinct(courses.teacherId),
      syncedAt: min(courses.createdAt),
    })
    .from(courses)
    .where(
      and(
        eq(courses.scope, scope),
        gte(courses.date, sql`NOW() - INTERVAL '61 months'`),
      ),
    )
    .groupBy(sql`month`)
    .orderBy(sql`month DESC`);

  return results;
}
