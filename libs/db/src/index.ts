import {
  and,
  between,
  countDistinct,
  desc,
  eq,
  gte,
  lt,
  min,
  sql,
} from "drizzle-orm";

import { db } from "./db";
import { courses, features, teachers } from "./schema";

export interface CourseSyncData {
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

export async function syncCoursesForMonth(
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

    // upsert teachers
    await tx.insert(teachers).values(teachersData).onConflictDoNothing();

    // insert courses
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
        sql`websearch_to_tsquery('norwegian', ${query}) @@ ${courses.contentSearch}`,
      ),
    )
    .orderBy(courses.teacherId, desc(courses.date));
}

export async function getTeachersSyncedByMonthsLastFiveYears(
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

export async function getFeatureSettings(
  featureName: "kurslarer",
  session: Record<string, unknown> | null,
): Promise<{ dbScope: string; dataScope: string } | null>;
export async function getFeatureSettings(
  featureName: string,
  session: Record<string, unknown> | null,
) {
  const organizationId = session?.["activeOrganizationId"] as string;
  if (!organizationId) {
    return null;
  }

  const result = await db
    .select()
    .from(features)
    .where(
      and(
        eq(features.name, featureName),
        eq(features.organizationId, organizationId),
      ),
    );

  const settings = result[0]?.settings;
  if (!settings) {
    return null;
  }

  return settings;
}
