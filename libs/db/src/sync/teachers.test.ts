// src/sync/teachers.test.ts
import { and, eq, sql } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import { courses, teacherAliases, teachers } from "../schema";
import { baseCourse, seed } from "../test/seed";
import { createTestDb } from "../test/test-db";
import { syncCoursesForMonth } from "./index";
import {
  findTeachers,
  listAliases,
  listRedactedTeachers,
  mergeTeachers,
  redactTeacher,
  unmergeTeacher,
  unredactTeacher,
} from "./teachers";

let db: Awaited<ReturnType<typeof createTestDb>>;

beforeAll(async () => {
  db = await createTestDb();
});

beforeEach(async () => {
  await db.execute(
    sql`TRUNCATE courses, teachers, teacher_aliases RESTART IDENTITY CASCADE`,
  );
});

const tick = () => new Promise((resolve) => setTimeout(resolve, 5));

const teacher = async (scope: string, id: string) => {
  const [row] = await db
    .select()
    .from(teachers)
    .where(and(eq(teachers.scope, scope), eq(teachers.id, id)));
  return row;
};

const courseRows = (scope = "s1") =>
  db.select().from(courses).where(eq(courses.scope, scope));

const titles = async (scope = "s1") =>
  (await courseRows(scope)).map((c) => c.title).sort();

describe("redactTeacher", () => {
  it("removes the teacher's courses, keeps the name and sets redactedAt", async () => {
    await seed(
      db,
      { title: "A" },
      { teacherId: "t2", teacherName: "Ola Hansen", title: "B" },
    );

    await redactTeacher(db, "s1", "t1", "Kari Nordmann");

    expect(await titles()).toEqual(["B"]);
    const redacted = await teacher("s1", "t1");
    expect(redacted?.name).toBe("Kari Nordmann");
    expect(redacted?.redactedAt).toBeInstanceOf(Date);
  });

  it("leaves other teachers untouched", async () => {
    await seed(db, {}, { teacherId: "t2", teacherName: "Ola Hansen" });
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    expect((await teacher("s1", "t2"))?.redactedAt).toBeNull();
  });

  it("removes the teacher's courses from every month", async () => {
    await seed(db, { date: "2026-03-10" }, { date: "2026-04-10" });
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    expect(await courseRows()).toHaveLength(0);
  });

  it("only affects the given scope", async () => {
    await seed(db, { title: "S1" }, { scope: "s2", title: "S2" });
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    expect(await titles("s1")).toEqual([]);
    expect(await titles("s2")).toEqual(["S2"]);
    expect((await teacher("s2", "t1"))?.redactedAt).toBeNull();
  });

  it("keeps the first timestamp when redacting twice", async () => {
    await seed(db, {});
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    const first = (await teacher("s1", "t1"))?.redactedAt;
    await tick();
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    const second = (await teacher("s1", "t1"))?.redactedAt;
    expect(second?.getTime()).toBe(first?.getTime());
  });

  it("creates a tombstone for a key that was never synced", async () => {
    await redactTeacher(db, "s1", "ghost", "Ghost Person");
    const row = await teacher("s1", "ghost");
    expect(row?.name).toBe("Ghost Person");
    expect(row?.redactedAt).toBeInstanceOf(Date);
  });

  it("redacting an alias redacts the teacher it was merged into", async () => {
    await seed(db, {});
    await db
      .insert(teacherAliases)
      .values({ scope: "s1", aliasId: "old", teacherId: "t1" });

    await redactTeacher(db, "s1", "old", "Kari Nordmann");

    expect((await teacher("s1", "t1"))?.redactedAt).toBeInstanceOf(Date);
    expect(await teacher("s1", "old")).toBeUndefined();
    expect(await courseRows()).toHaveLength(0);
  });
});

describe("sync after redaction", () => {
  const month = (overrides: Partial<typeof baseCourse>[]) =>
    syncCoursesForMonth(
      db,
      "s1",
      2026,
      3,
      overrides.map((o, i) => ({ ...baseCourse, courseId: i + 1, ...o })),
    );

  it("skips a redacted teacher but inserts everyone else in the batch", async () => {
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    await month([
      { title: "Redacted" },
      { teacherId: "t2", teacherName: "Ola Hansen", title: "Visible" },
    ]);
    expect(await titles()).toEqual(["Visible"]);
  });

  it("skips a teacher that was redacted before ever being synced", async () => {
    await redactTeacher(db, "s1", "ghost", "Ghost Person");
    await month([{ teacherId: "ghost", teacherName: "Ghost Person" }]);
    expect(await courseRows()).toHaveLength(0);
  });

  it("does not resurrect a redacted teacher's name or row", async () => {
    await seed(db, {});
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    await month([{ teacherName: "Kari Changed" }]);
    const row = await teacher("s1", "t1");
    expect(row?.name).toBe("Kari Nordmann");
    expect(row?.redactedAt).toBeInstanceOf(Date);
  });

  it("does not suppress a real teacher whose name is '-'", async () => {
    await month([{ teacherName: "-" }]);
    expect(await courseRows()).toHaveLength(1);
  });

  it("skips rows that arrive under an alias of a redacted teacher", async () => {
    await seed(db, {});
    await db
      .insert(teacherAliases)
      .values({ scope: "s1", aliasId: "old", teacherId: "t1" });
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    await month([{ teacherId: "old" }]);
    expect(await courseRows()).toHaveLength(0);
  });

  it("redaction in one scope does not suppress the same key in another", async () => {
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    await syncCoursesForMonth(db, "s2", 2026, 3, [
      { ...baseCourse, scope: "s2" },
    ]);
    expect(await courseRows("s2")).toHaveLength(1);
  });
});

describe("unredactTeacher", () => {
  it("deletes a redacted teacher and returns true", async () => {
    await seed(db, {});
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    expect(await unredactTeacher(db, "s1", "t1")).toBe(true);
    expect(await teacher("s1", "t1")).toBeUndefined();
  });

  it("brings the courses back on the next sync of their month", async () => {
    await seed(db, {});
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    await unredactTeacher(db, "s1", "t1");
    await syncCoursesForMonth(db, "s1", 2026, 3, [baseCourse]);
    expect(await titles()).toEqual(["Pianokurs"]);
    expect((await teacher("s1", "t1"))?.redactedAt).toBeNull();
  });

  it("refuses to delete a live teacher", async () => {
    await seed(db, {});
    expect(await unredactTeacher(db, "s1", "t1")).toBe(false);
    expect(await teacher("s1", "t1")).toBeDefined();
    expect(await courseRows()).toHaveLength(1);
  });

  it("returns false for an unknown teacher", async () => {
    expect(await unredactTeacher(db, "s1", "nobody")).toBe(false);
  });

  it("only resets the given scope", async () => {
    await seed(db, {}, { scope: "s2" });
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    await redactTeacher(db, "s2", "t1", "Kari Nordmann");
    await unredactTeacher(db, "s1", "t1");
    expect(await teacher("s1", "t1")).toBeUndefined();
    expect((await teacher("s2", "t1"))?.redactedAt).toBeInstanceOf(Date);
  });
});

describe("mergeTeachers", () => {
  const twoTeachers = () =>
    seed(
      db,
      { title: "A" },
      { teacherId: "t2", teacherName: "Kari N", title: "B" },
    );

  it("moves the source's courses to the target and removes the source", async () => {
    await twoTeachers();
    await mergeTeachers(db, "s1", "t2", "t1");

    const rows = await courseRows();
    expect(rows.map((c) => c.teacherId)).toEqual(["t1", "t1"]);
    expect(await teacher("s1", "t2")).toBeUndefined();
    expect(await teacher("s1", "t1")).toBeDefined();
  });

  it("keeps the original teacher_name on moved courses", async () => {
    await twoTeachers();
    await mergeTeachers(db, "s1", "t2", "t1");
    const moved = (await courseRows()).find((c) => c.title === "B");
    expect(moved?.teacherName).toBe("Kari N");
  });

  it("records an alias for the source key", async () => {
    await twoTeachers();
    await mergeTeachers(db, "s1", "t2", "t1");
    const aliases = await db.select().from(teacherAliases);
    expect(aliases).toEqual([{ scope: "s1", aliasId: "t2", teacherId: "t1" }]);
  });

  it("makes a later sync under the source key land on the target", async () => {
    await twoTeachers();
    await mergeTeachers(db, "s1", "t2", "t1");

    await syncCoursesForMonth(db, "s1", 2026, 3, [
      { ...baseCourse, teacherId: "t2", teacherName: "Kari N", title: "C" },
    ]);

    const rows = await courseRows();
    expect(rows.map((c) => [c.title, c.teacherId])).toEqual([["C", "t1"]]);
    expect(await db.select().from(teachers)).toHaveLength(1);
  });

  it("keeps alias chains flat", async () => {
    await seed(
      db,
      { teacherId: "a", teacherName: "A" },
      { teacherId: "b", teacherName: "B" },
      { teacherId: "c", teacherName: "C" },
    );
    await mergeTeachers(db, "s1", "a", "b");
    await mergeTeachers(db, "s1", "b", "c");

    const aliases = (await db.select().from(teacherAliases))
      .map((x) => [x.aliasId, x.teacherId])
      .sort();
    expect(aliases).toEqual([
      ["a", "c"],
      ["b", "c"],
    ]);
    expect((await courseRows()).every((c) => c.teacherId === "c")).toBe(true);
  });

  it("resolves a target given as an alias", async () => {
    await seed(
      db,
      { teacherId: "a", teacherName: "A" },
      { teacherId: "b", teacherName: "B" },
      { teacherId: "c", teacherName: "C" },
    );
    await mergeTeachers(db, "s1", "b", "a"); // b is now an alias of a
    await mergeTeachers(db, "s1", "c", "b"); // target "b" means a
    expect((await courseRows()).every((c) => c.teacherId === "a")).toBe(true);
  });

  it("works for a source key that was never synced", async () => {
    await seed(db, {});
    await mergeTeachers(db, "s1", "ghost", "t1");
    const aliases = await db.select().from(teacherAliases);
    expect(aliases).toEqual([
      { scope: "s1", aliasId: "ghost", teacherId: "t1" },
    ]);
  });

  it("rejects merging a teacher into itself", async () => {
    await seed(db, {});
    await expect(mergeTeachers(db, "s1", "t1", "t1")).rejects.toThrow(
      "Cannot merge a teacher into itself",
    );
  });

  it("rejects merging into the teacher the source is already an alias of", async () => {
    await twoTeachers();
    await mergeTeachers(db, "s1", "t2", "t1");
    await expect(mergeTeachers(db, "s1", "t1", "t2")).rejects.toThrow(
      "Cannot merge a teacher into itself",
    );
  });

  it("rejects an unknown target and changes nothing", async () => {
    await seed(db, {});
    await expect(mergeTeachers(db, "s1", "t1", "missing")).rejects.toThrow(
      "Target teacher not found",
    );
    expect(await titles()).toEqual(["Pianokurs"]);
    expect(await db.select().from(teacherAliases)).toHaveLength(0);
  });

  it("rejects merging a live teacher with a redacted one", async () => {
    await twoTeachers();
    await redactTeacher(db, "s1", "t2", "Kari N");
    await expect(mergeTeachers(db, "s1", "t1", "t2")).rejects.toThrow(
      "Redaction state differs",
    );
    expect(await titles()).toEqual(["A"]); // t1's course was not moved: t2 has none, t1's are intact?
  });

  it("allows merging two redacted teachers", async () => {
    await seed(
      db,
      { teacherId: "a", teacherName: "A" },
      { teacherId: "b", teacherName: "B" },
    );
    await redactTeacher(db, "s1", "a", "A");
    await redactTeacher(db, "s1", "b", "B");
    await mergeTeachers(db, "s1", "b", "a");
    expect(await teacher("s1", "b")).toBeUndefined();
    expect((await teacher("s1", "a"))?.redactedAt).toBeInstanceOf(Date);
  });

  it("only affects the given scope", async () => {
    await seed(
      db,
      {},
      { teacherId: "t2", teacherName: "Kari N" },
      { scope: "s2" },
      { scope: "s2", teacherId: "t2", teacherName: "Kari N" },
    );
    await mergeTeachers(db, "s1", "t2", "t1");
    expect(await teacher("s2", "t2")).toBeDefined();
    expect((await courseRows("s2")).map((c) => c.teacherId).sort()).toEqual([
      "t1",
      "t2",
    ]);
  });
});

describe("findTeachers", () => {
  it("matches names case-insensitively, scoped, with course counts", async () => {
    await seed(
      db,
      {},
      { teacherId: "t2", teacherName: "Ola Hansen" },
      { scope: "s2", teacherId: "t3", teacherName: "Kari Other" },
    );
    const found = await findTeachers(db, "s1", "KARI");
    expect(found.map((t) => [t.id, t.courseCount])).toEqual([["t1", 1]]);
  });

  it("counts only the teacher's courses in the same scope", async () => {
    await seed(db, {}, {}, { scope: "s2" }); // t1 has two courses in s1, one in s2
    const [found] = await findTeachers(db, "s1", "kari");
    expect(found?.courseCount).toBe(2);
  });

  it("includes redacted teachers, with no courses", async () => {
    await seed(db, {});
    await redactTeacher(db, "s1", "t1", "Kari Nordmann");
    const [found] = await findTeachers(db, "s1", "kari");
    expect(found?.redactedAt).toBeInstanceOf(Date);
    expect(found?.courseCount).toBe(0);
  });

  it("treats % as a literal character", async () => {
    await seed(
      db,
      { teacherName: "A%B" },
      { teacherId: "t2", teacherName: "Other" },
    );
    const found = await findTeachers(db, "s1", "%");
    expect(found.map((t) => t.id)).toEqual(["t1"]);
  });

  it("returns at most 50 teachers", async () => {
    const many = Array.from({ length: 60 }, (_, i) => ({
      teacherId: `t${i}`,
      teacherName: `Teacher ${i}`,
    }));
    await seed(db, ...many);
    expect(await findTeachers(db, "s1", "teacher")).toHaveLength(50);
  });
});

describe("listRedactedTeachers", () => {
  it("lists only redacted teachers in the scope, newest first", async () => {
    await seed(
      db,
      { teacherId: "t1", teacherName: "One" },
      { teacherId: "t2", teacherName: "Two" },
      { teacherId: "t3", teacherName: "Three" },
      { scope: "s2", teacherId: "t1", teacherName: "One" },
    );
    await redactTeacher(db, "s1", "t1", "One");
    await tick();
    await redactTeacher(db, "s1", "t2", "Two");
    await redactTeacher(db, "s2", "t1", "One");

    const list = await listRedactedTeachers(db, "s1");
    expect(list.map((t) => t.id)).toEqual(["t2", "t1"]);
    expect(list.every((t) => t.redactedAt instanceof Date)).toBe(true);
  });

  it("is empty when nobody is redacted", async () => {
    await seed(db, {});
    expect(await listRedactedTeachers(db, "s1")).toEqual([]);
  });
});

describe("unmergeTeacher", () => {
  const mergedPair = async () => {
    await seed(
      db,
      { title: "A" },
      { teacherId: "t2", teacherName: "Kari N", title: "B" },
    );
    await mergeTeachers(db, "s1", "t2", "t1");
  };

  it("removes the alias and returns true", async () => {
    await mergedPair();
    expect(await unmergeTeacher(db, "s1", "t2")).toBe(true);
    expect(await db.select().from(teacherAliases)).toHaveLength(0);
  });

  it("returns false for an unknown alias and changes nothing", async () => {
    await mergedPair();
    expect(await unmergeTeacher(db, "s1", "nobody")).toBe(false);
    expect(await db.select().from(teacherAliases)).toHaveLength(1);
  });

  it("leaves already-moved courses on the target until their month is synced again", async () => {
    await mergedPair();
    await unmergeTeacher(db, "s1", "t2");
    expect((await courseRows()).map((c) => c.teacherId)).toEqual(["t1", "t1"]);
  });

  it("splits the courses again when the month is resynced", async () => {
    await mergedPair();
    await unmergeTeacher(db, "s1", "t2");

    await syncCoursesForMonth(db, "s1", 2026, 3, [
      { ...baseCourse, courseId: 1, title: "A" },
      {
        ...baseCourse,
        courseId: 2,
        teacherId: "t2",
        teacherName: "Kari N",
        title: "B",
      },
    ]);

    const rows = await courseRows();
    expect(rows.map((c) => [c.title, c.teacherId]).sort()).toEqual([
      ["A", "t1"],
      ["B", "t2"],
    ]);
    expect(await db.select().from(teachers)).toHaveLength(2);
  });

  it("keeps other aliases of the same target", async () => {
    await seed(
      db,
      { teacherId: "a", teacherName: "A" },
      { teacherId: "b", teacherName: "B" },
      { teacherId: "c", teacherName: "C" },
    );
    await mergeTeachers(db, "s1", "a", "c");
    await mergeTeachers(db, "s1", "b", "c");
    await unmergeTeacher(db, "s1", "a");
    expect(await db.select().from(teacherAliases)).toEqual([
      { scope: "s1", aliasId: "b", teacherId: "c" },
    ]);
  });

  it("can be merged again afterwards", async () => {
    await mergedPair();
    await unmergeTeacher(db, "s1", "t2");
    await syncCoursesForMonth(db, "s1", 2026, 3, [
      { ...baseCourse, courseId: 1, title: "A" },
      {
        ...baseCourse,
        courseId: 2,
        teacherId: "t2",
        teacherName: "Kari N",
        title: "B",
      },
    ]);
    await mergeTeachers(db, "s1", "t2", "t1");
    expect((await courseRows()).every((c) => c.teacherId === "t1")).toBe(true);
    expect(await db.select().from(teacherAliases)).toHaveLength(1);
  });

  it("only affects the given scope", async () => {
    await seed(
      db,
      {},
      { teacherId: "t2", teacherName: "Kari N" },
      { scope: "s2" },
      { scope: "s2", teacherId: "t2", teacherName: "Kari N" },
    );
    await mergeTeachers(db, "s1", "t2", "t1");
    await mergeTeachers(db, "s2", "t2", "t1");
    await unmergeTeacher(db, "s1", "t2");
    expect(await db.select().from(teacherAliases)).toEqual([
      { scope: "s2", aliasId: "t2", teacherId: "t1" },
    ]);
  });

  describe("when the target is redacted", () => {
    const redactedPair = async () => {
      await seed(
        db,
        { teacherId: "a", teacherName: "A" },
        { teacherId: "b", teacherName: "B" },
      );
      await redactTeacher(db, "s1", "a", "A");
      await redactTeacher(db, "s1", "b", "B");
      await mergeTeachers(db, "s1", "b", "a");
    };

    it("requires a name and changes nothing without one", async () => {
      await redactedPair();
      await expect(unmergeTeacher(db, "s1", "b")).rejects.toThrow(
        "Target is redacted",
      );
      expect(await db.select().from(teacherAliases)).toHaveLength(1);
      expect(await teacher("s1", "b")).toBeUndefined();
    });

    it("keeps the alias key redacted, so a later sync does not expose it", async () => {
      await redactedPair();
      await unmergeTeacher(db, "s1", "b", { name: "B" });

      const tombstone = await teacher("s1", "b");
      expect(tombstone?.name).toBe("B");
      expect(tombstone?.redactedAt).toBeInstanceOf(Date);

      await syncCoursesForMonth(db, "s1", 2026, 3, [
        { ...baseCourse, teacherId: "b", teacherName: "B" },
      ]);
      expect(await courseRows()).toHaveLength(0);
    });
  });

  it("ignores the name when the target is not redacted", async () => {
    await mergedPair();
    await unmergeTeacher(db, "s1", "t2", { name: "Ignored" });
    expect(await teacher("s1", "t2")).toBeUndefined();
  });
});

describe("listAliases", () => {
  it("lists the aliases merged into a teacher, scoped", async () => {
    await seed(
      db,
      { teacherId: "a", teacherName: "A" },
      { teacherId: "b", teacherName: "B" },
      { teacherId: "c", teacherName: "C" },
    );
    await mergeTeachers(db, "s1", "b", "a");
    await mergeTeachers(db, "s1", "c", "a");
    expect((await listAliases(db, "s1", "a")).map((x) => x.aliasId)).toEqual([
      "b",
      "c",
    ]);
    expect(await listAliases(db, "s2", "a")).toEqual([]);
  });
});
