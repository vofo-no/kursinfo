import { and, desc, eq, isNotNull, sql } from "drizzle-orm";

import { courses, teacherAliases, teachers } from "../schema";
import { SYNC_LOCK, type Database } from "./types";

export function findTeachers(db: Database, scope: string, text: string) {
  return db
    .select({
      id: teachers.id,
      name: teachers.name,
      redactedAt: teachers.redactedAt,
      courseCount: sql<number>`(
        SELECT count(*) FROM courses c
        WHERE c.scope = teachers.scope AND c.teacher_id = teachers.id
      )::int`,
    })
    .from(teachers)
    .where(
      and(
        eq(teachers.scope, scope),
        sql`strpos(lower(${teachers.name}), lower(${text})) > 0`,
      ),
    )
    .orderBy(teachers.name)
    .limit(50);
}

// so an admin can see what is merged into a teacher, and pick the alias to undo
export function listAliases(db: Database, scope: string, teacherId: string) {
  return db
    .select({ aliasId: teacherAliases.aliasId })
    .from(teacherAliases)
    .where(
      and(
        eq(teacherAliases.scope, scope),
        eq(teacherAliases.teacherId, teacherId),
      ),
    )
    .orderBy(teacherAliases.aliasId);
}

export function listRedactedTeachers(db: Database, scope: string) {
  return db
    .select({
      id: teachers.id,
      name: teachers.name,
      redactedAt: teachers.redactedAt,
    })
    .from(teachers)
    .where(and(eq(teachers.scope, scope), isNotNull(teachers.redactedAt)))
    .orderBy(desc(teachers.redactedAt));
}

export async function redactTeacher(
  db: Database,
  scope: string,
  teacherKey: string,
  name: string, // only used if the teacher has never been synced
) {
  await db.transaction(async (tx) => {
    await tx.execute(SYNC_LOCK);
    const [alias] = await tx
      .select()
      .from(teacherAliases)
      .where(
        and(
          eq(teacherAliases.scope, scope),
          eq(teacherAliases.aliasId, teacherKey),
        ),
      );
    const id = alias?.teacherId ?? teacherKey;

    await tx
      .delete(courses)
      .where(and(eq(courses.scope, scope), eq(courses.teacherId, id)));
    await tx
      .insert(teachers)
      .values({ scope, id, name, redactedAt: new Date() })
      .onConflictDoUpdate({
        target: [teachers.scope, teachers.id],
        set: { redactedAt: sql`coalesce(${teachers.redactedAt}, now())` },
      });
  });
}

export async function unredactTeacher(
  db: Database,
  scope: string,
  teacherId: string,
) {
  const deleted = await db.transaction(async (tx) => {
    await tx.execute(SYNC_LOCK);
    return tx
      .delete(teachers)
      .where(
        and(
          eq(teachers.scope, scope),
          eq(teachers.id, teacherId),
          isNotNull(teachers.redactedAt),
        ),
      )
      .returning({ id: teachers.id });
  });
  return deleted.length > 0;
}

export async function mergeTeachers(
  db: Database,
  scope: string,
  sourceId: string,
  targetId: string,
) {
  await db.transaction(async (tx) => {
    await tx.execute(SYNC_LOCK);

    const [viaAlias] = await tx
      .select()
      .from(teacherAliases)
      .where(
        and(
          eq(teacherAliases.scope, scope),
          eq(teacherAliases.aliasId, targetId),
        ),
      );
    const target = viaAlias?.teacherId ?? targetId;
    if (target === sourceId)
      throw new Error("Cannot merge a teacher into itself");

    const [targetRow] = await tx
      .select()
      .from(teachers)
      .where(and(eq(teachers.scope, scope), eq(teachers.id, target)));
    if (!targetRow) throw new Error(`Target teacher not found: ${target}`);
    const [sourceRow] = await tx
      .select()
      .from(teachers)
      .where(and(eq(teachers.scope, scope), eq(teachers.id, sourceId)));
    if (sourceRow && !!sourceRow.redactedAt !== !!targetRow.redactedAt) {
      throw new Error("Redaction state differs; align it before merging");
    }

    await tx
      .update(courses)
      .set({ teacherId: target })
      .where(and(eq(courses.scope, scope), eq(courses.teacherId, sourceId)));
    await tx
      .update(teacherAliases)
      .set({ teacherId: target })
      .where(
        and(
          eq(teacherAliases.scope, scope),
          eq(teacherAliases.teacherId, sourceId),
        ),
      );
    await tx
      .insert(teacherAliases)
      .values({ scope, aliasId: sourceId, teacherId: target })
      .onConflictDoUpdate({
        target: [teacherAliases.scope, teacherAliases.aliasId],
        set: { teacherId: target },
      });
    await tx
      .delete(teachers)
      .where(and(eq(teachers.scope, scope), eq(teachers.id, sourceId)));
  });
}

export async function unmergeTeacher(
  db: Database,
  scope: string,
  aliasId: string,
  { name }: { name?: string } = {}, // required only when the target is redacted
) {
  return db.transaction(async (tx) => {
    await tx.execute(SYNC_LOCK);

    const [alias] = await tx
      .select()
      .from(teacherAliases)
      .where(
        and(
          eq(teacherAliases.scope, scope),
          eq(teacherAliases.aliasId, aliasId),
        ),
      );
    if (!alias) return false;

    const [target] = await tx
      .select()
      .from(teachers)
      .where(and(eq(teachers.scope, scope), eq(teachers.id, alias.teacherId)));

    if (target?.redactedAt) {
      if (!name) {
        throw new Error(
          "Target is redacted; pass the name so the alias stays hidden",
        );
      }
      await tx
        .insert(teachers)
        .values({ scope, id: aliasId, name, redactedAt: target.redactedAt })
        .onConflictDoNothing();
    }

    await tx
      .delete(teacherAliases)
      .where(
        and(
          eq(teacherAliases.scope, scope),
          eq(teacherAliases.aliasId, aliasId),
        ),
      );
    return true;
  });
}
