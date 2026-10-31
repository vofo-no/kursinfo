import { sql } from "drizzle-orm";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "../db";
import { seed } from "../test/seed";
import {
  getCounties,
  getOrganizations,
  getTeachersMatchingQuery,
} from "./teachers";

vi.mock("../db", async () => {
  const { createTestDb } = await import("../test/test-db");
  return { db: await createTestDb() };
});

beforeEach(async () => {
  await db.execute(sql`TRUNCATE courses, teachers RESTART IDENTITY CASCADE`);
});

afterEach(() => {
  vi.useRealTimers();
});

const names = (rows: Awaited<ReturnType<typeof getTeachersMatchingQuery>>) =>
  rows.map((r) => r.teachers.name);

describe("getTeachersMatchingQuery: text search", () => {
  it("matches on teacher name, case-insensitively", async () => {
    await seed(db, {}, { teacherId: "t2", teacherName: "Ola Hansen" });
    expect(
      names(await getTeachersMatchingQuery("s1", { query: "kari" })),
    ).toEqual(["Kari Nordmann"]);
  });

  it("matches on title, curriculum, organizer and organization", async () => {
    await seed(db, {});
    for (const query of ["Pianokurs", "Grunnleggende", "Musikklag", "Noregs"]) {
      expect(await getTeachersMatchingQuery("s1", { query })).toHaveLength(1);
    }
  });

  it("ANDs terms across name and organization", async () => {
    await seed(
      db,
      {},
      {
        teacherId: "t2",
        teacherName: "Ola Hansen",
        organization: "Fjellforbundet",
      },
    );
    const hit = await getTeachersMatchingQuery("s1", { query: "Kari Noregs" });
    const miss = await getTeachersMatchingQuery("s1", {
      query: "Kari Fjellforbundet",
    });
    expect(names(hit)).toEqual(["Kari Nordmann"]);
    expect(miss).toHaveLength(0);
  });

  it("stems Norwegian inflections", async () => {
    await seed(db, { title: "Pianoene", curriculum: "Introduksjon" });
    expect(
      await getTeachersMatchingQuery("s1", { query: "pianoer" }),
    ).toHaveLength(1);
  });

  it("returns nothing for a stop-word-only query (documents current behavior)", async () => {
    await seed(db, {});
    expect(await getTeachersMatchingQuery("s1", { query: "og" })).toHaveLength(
      0,
    );
  });
});

describe("getTeachersMatchingQuery: filters", () => {
  it("ORs within a filter and ANDs across filters", async () => {
    await seed(
      db,
      { county: "Oslo" },
      { county: "Akershus", teacherId: "t2" },
      { county: "Vestland", teacherId: "t3" },
      { county: "Oslo", organization: "Fjellforbundet", teacherId: "t4" },
    );
    const rows = await getTeachersMatchingQuery("s1", {
      county: ["Oslo", "Akershus"],
      organization: ["Noregs ungdomslag"],
    });
    expect(rows).toHaveLength(2);
  });

  it("ORs multiple organizations", async () => {
    await seed(
      db,
      {},
      { organization: "Fjellforbundet", teacherId: "t2" },
      { organization: "Other", teacherId: "t3" },
    );
    const rows = await getTeachersMatchingQuery("s1", {
      organization: ["Noregs ungdomslag", "Fjellforbundet"],
    });
    expect(rows).toHaveLength(2);
  });

  it("combines query and filters", async () => {
    await seed(
      db,
      {},
      { county: "Akershus", teacherId: "t2", teacherName: "Kari Berg" },
    );
    const rows = await getTeachersMatchingQuery("s1", {
      query: "Kari",
      county: ["Akershus"],
    });
    expect(names(rows)).toEqual(["Kari Berg"]);
  });

  it("treats empty arrays, blank query and no options as no filter", async () => {
    await seed(db, {}, { teacherId: "t2" });
    expect(
      await getTeachersMatchingQuery("s1", {
        query: "   ",
        county: [],
        organization: [],
      }),
    ).toHaveLength(2);
    expect(await getTeachersMatchingQuery("s1")).toHaveLength(2);
  });

  it("does not leak across scopes", async () => {
    await seed(db, {}, { scope: "s2" });
    expect(await getTeachersMatchingQuery("s1")).toHaveLength(1);
    expect(await getTeachersMatchingQuery("s2")).toHaveLength(1);
  });

  it("respects yearsBack", async () => {
    // fake only Date so PGlite's timers keep working
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-30"));
    await seed(
      db,
      { date: "2026-03-10" },
      { date: "2023-03-10", teacherId: "t2" },
    );
    expect(await getTeachersMatchingQuery("s1", { yearsBack: 1 })).toHaveLength(
      1,
    );
    expect(await getTeachersMatchingQuery("s1", { yearsBack: 5 })).toHaveLength(
      2,
    );
  });
});

describe("getTeachersMatchingQuery: result shape", () => {
  it("orders by teacher id, then newest course first", async () => {
    await seed(
      db,
      { date: "2026-02-01" },
      { date: "2026-04-01", teacherId: "t1" },
      { date: "2026-03-01", teacherId: "a" },
    );
    const rows = await getTeachersMatchingQuery("s1");
    expect(rows.map((r) => [r.teachers.id, r.courses.date])).toEqual([
      ["s1-a", "2026-03-01"],
      ["s1-t1", "2026-04-01"],
      ["s1-t1", "2026-02-01"],
    ]);
  });
});

describe("getCounties / getOrganizations", () => {
  it("returns distinct, scoped, Norwegian-sorted values", async () => {
    await seed(
      db,
      { county: "Østfold" },
      { county: "Åland", teacherId: "t2" },
      { county: "Oslo", teacherId: "t3" },
      { county: "Oslo", teacherId: "t4" },
      { county: "Hidden", scope: "s2", teacherId: "t5" },
    );
    expect(await getCounties("s1")).toEqual(["Oslo", "Østfold", "Åland"]);
  });

  it("lists organizations for the scope only", async () => {
    await seed(
      db,
      {},
      { organization: "Fjellforbundet", teacherId: "t2" },
      { organization: "Secret", scope: "s2", teacherId: "t3" },
    );
    expect(await getOrganizations("s1")).toEqual([
      "Fjellforbundet",
      "Noregs ungdomslag",
    ]);
  });
});
