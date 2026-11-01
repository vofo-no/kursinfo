import { sql } from "drizzle-orm";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import { courses, teachers } from "../schema";
import { baseCourse, seed } from "../test/seed";
import { createTestDb } from "../test/test-db";
import { getSyncStatus, syncCoursesForMonth } from "./sync";

let db: Awaited<ReturnType<typeof createTestDb>>;

beforeAll(async () => {
  db = await createTestDb();
});

beforeEach(async () => {
  await db.execute(sql`TRUNCATE courses, teachers RESTART IDENTITY CASCADE`);
});

const titles = async () =>
  (await db.select().from(courses)).map((c) => c.title).sort();

describe("syncCoursesForMonth", () => {
  it("throws on scope mismatch and changes nothing", async () => {
    await seed(db, {});
    await expect(
      syncCoursesForMonth(db, "s1", 2026, 3, [
        { ...baseCourse, scope: "other" },
      ]),
    ).rejects.toThrow("Scope mismatch");
    expect(await titles()).toEqual(["Pianokurs"]);
  });

  it("replaces only the given scope and month", async () => {
    await seed(
      db,
      { date: "2026-03-10" },
      { date: "2026-04-10", title: "April" },
      { date: "2026-03-10", scope: "s2", title: "Other scope" },
    );
    await syncCoursesForMonth(db, "s1", 2026, 3, [
      { ...baseCourse, title: "Gitarkurs", date: "2026-03-12" },
    ]);
    expect(await titles()).toEqual(["April", "Gitarkurs", "Other scope"]);
  });

  it("includes the first and last day of the month, excludes the neighbours", async () => {
    await seed(
      db,
      { date: "2026-02-28", title: "Feb" },
      { date: "2026-03-01", title: "First" },
      { date: "2026-03-31", title: "Last" },
      { date: "2026-04-01", title: "Apr" },
    );
    await syncCoursesForMonth(db, "s1", 2026, 3, []);
    expect(await titles()).toEqual(["Apr", "Feb"]);
  });

  it("stores the bare teacher key together with its scope", async () => {
    await seed(db, {});
    const [teacher] = await db.select().from(teachers);
    expect(teacher).toMatchObject({ scope: "s1", id: "t1" });
  });

  it("does not mutate its input, so the same array can be synced twice", async () => {
    const input = [{ ...baseCourse }];
    await syncCoursesForMonth(db, "s1", 2026, 3, input);
    await syncCoursesForMonth(db, "s1", 2026, 3, input);
    expect(input[0]!.teacherId).toBe("t1");
    expect((await db.select().from(teachers)).map((t) => t.id)).toEqual(["t1"]);
    expect(await db.select().from(courses)).toHaveLength(1);
  });

  it("keeps one teacher row across repeated syncs", async () => {
    await seed(db, {});
    await syncCoursesForMonth(db, "s1", 2026, 4, [
      { ...baseCourse, date: "2026-04-10" },
    ]);
    expect(await db.select().from(teachers)).toHaveLength(1);
  });

  it("clears the month when given no courses, without throwing", async () => {
    await seed(db, {});
    await syncCoursesForMonth(db, "s1", 2026, 3, []);
    expect(await db.select().from(courses)).toHaveLength(0);
  });

  it("rolls back the delete if the insert fails", async () => {
    await seed(db, {});
    await expect(
      syncCoursesForMonth(db, "s1", 2026, 3, [
        { ...baseCourse, title: null as unknown as string },
      ]),
    ).rejects.toThrow();
    expect(await titles()).toEqual(["Pianokurs"]);
  });
});

describe("getSyncStatus", () => {
  const monthsAgo = (n: number) => {
    const d = new Date();
    d.setUTCDate(15);
    d.setUTCMonth(d.getUTCMonth() - n);
    return d.toISOString().slice(0, 10);
  };

  it("counts distinct teachers per month, newest first, scoped", async () => {
    await seed(
      db,
      { date: monthsAgo(1) },
      { date: monthsAgo(1), teacherId: "t2" },
      { date: monthsAgo(1), teacherId: "t2", title: "Same teacher again" },
      { date: monthsAgo(2) },
      { date: monthsAgo(1), scope: "s2", teacherId: "x" },
    );
    const status = await getSyncStatus(db, "s1");
    expect(status.map((s) => [s.month, s.teacherCount])).toEqual([
      [monthsAgo(1).slice(0, 7), 2],
      [monthsAgo(2).slice(0, 7), 1],
    ]);
    expect(status[0]!.syncedAt).toBeInstanceOf(Date);
  });

  it("ignores months older than five years", async () => {
    await seed(
      db,
      { date: monthsAgo(70) },
      { date: monthsAgo(3), teacherId: "t2" },
    );
    expect(await getSyncStatus(db, "s1")).toHaveLength(1);
  });
});

describe("scope isolation in the schema", () => {
  const course = {
    courseId: 1,
    title: "X",
    curriculum: "X",
    organizer: "X",
    organization: "X",
    county: "Oslo",
    date: "2026-03-10",
    teacherName: "Kari",
  };

  it("rejects a course that references a teacher in another scope", async () => {
    await db.insert(teachers).values({ scope: "s1", id: "t1", name: "Kari" });
    await expect(
      db.insert(courses).values({ ...course, scope: "s2", teacherId: "t1" }),
    ).rejects.toThrow();
  });

  it("keeps the same key in two scopes as two separate teachers", async () => {
    await seed(db, {}, { scope: "s2", teacherName: "Someone Else" });
    expect(await db.select().from(teachers)).toHaveLength(2);
  });

  it("has the intended indexes", async () => {
    const { rows } = await db.execute(
      sql`SELECT indexname FROM pg_indexes WHERE tablename = 'courses'`,
    );
    const names = rows.map((r) => String(r.indexname));
    expect(names).toEqual(
      expect.arrayContaining([
        "idx_scope_date",
        "idx_scope_teacher",
        "idx_content_search",
      ]),
    );
    expect(names).not.toContain("idx_scope");
    expect(names).not.toContain("idx_date");
  });
});
