import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";

import { db } from "../db";
import { courses, teachers } from "../schema";

export interface TeacherSearchOptions {
  query?: string;
  organization?: string[];
  county?: string[];
  yearsBack?: number;
}

export async function getTeachersMatchingQuery(
  scope: string,
  { query, organization, county, yearsBack }: TeacherSearchOptions = {},
) {
  const conditions = [eq(courses.scope, scope)];

  if (yearsBack !== undefined) {
    const currentYear = new Date().getUTCFullYear();
    conditions.push(gte(courses.date, `${currentYear - yearsBack}-01-01`));
  }

  if (county?.length) conditions.push(inArray(courses.county, county));

  if (organization?.length) {
    conditions.push(inArray(courses.organization, organization));
  }

  const trimmed = query?.trim();
  if (trimmed) {
    conditions.push(
      sql`${courses.contentSearch} @@ websearch_to_tsquery('norwegian', ${trimmed})`,
    );
  }

  return db
    .select()
    .from(courses)
    .innerJoin(
      teachers,
      and(
        eq(courses.scope, teachers.scope),
        eq(courses.teacherId, teachers.id),
      ),
    )
    .where(and(...conditions))
    .orderBy(courses.teacherId, desc(courses.date));
}

async function getDistinctValues(
  scope: string,
  column: typeof courses.county | typeof courses.organization,
): Promise<string[]> {
  const rows = await db
    .selectDistinct({ value: column })
    .from(courses)
    .where(eq(courses.scope, scope));

  return rows.map((r) => r.value).sort((a, b) => a.localeCompare(b, "nb"));
}

export const getCounties = (scope: string) =>
  getDistinctValues(scope, courses.county);

export const getOrganizations = (scope: string) =>
  getDistinctValues(scope, courses.organization);
