import {
  and,
  between,
  countDistinct,
  eq,
  gte,
  inArray,
  isNotNull,
  min,
  sql,
} from "drizzle-orm";

import { courses, teacherAliases, teachers } from "../schema";
import { SYNC_LOCK, type CourseSyncData, type Database } from "./types";

export async function syncCoursesForMonth(
  db: Database,
  scope: string,
  year: number,
  month: number,
  syncData: CourseSyncData[],
) {
  for (const course of syncData) {
    if (course.scope !== scope) {
      throw new Error(`Scope mismatch: expected ${scope}, got ${course.scope}`);
    }
  }

  const monthStart = new Date(Date.UTC(year, month - 1, 1));
  const monthEnd = new Date(Date.UTC(year, month, 0));

  await db.transaction(async (tx) => {
    await tx.execute(SYNC_LOCK);

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

    if (syncData.length === 0) return;

    // map keys that were merged into another teacher onto that teacher
    const keys = [...new Set(syncData.map((r) => r.teacherId))];
    const aliases = new Map(
      (
        await tx
          .select()
          .from(teacherAliases)
          .where(
            and(
              eq(teacherAliases.scope, scope),
              inArray(teacherAliases.aliasId, keys),
            ),
          )
      ).map((a) => [a.aliasId, a.teacherId]),
    );
    const resolved = syncData.map((r) => ({
      ...r,
      teacherId: aliases.get(r.teacherId) ?? r.teacherId,
    }));

    // drop rows for redacted teachers
    const ids = [...new Set(resolved.map((r) => r.teacherId))];
    const redacted = new Set(
      (
        await tx
          .select({ id: teachers.id })
          .from(teachers)
          .where(
            and(
              eq(teachers.scope, scope),
              inArray(teachers.id, ids),
              isNotNull(teachers.redactedAt),
            ),
          )
      ).map((t) => t.id),
    );
    const allowed = resolved.filter((r) => !redacted.has(r.teacherId));
    if (allowed.length === 0) return;

    const teachersData = [
      ...new Map(allowed.map((r) => [r.teacherId, r.teacherName])),
    ].map(([id, name]) => ({ scope, id, name }));

    await tx.insert(teachers).values(teachersData).onConflictDoNothing();
    await tx.insert(courses).values(allowed);
  });
}

export async function getSyncStatus(db: Database, scope: string) {
  return db
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
}
