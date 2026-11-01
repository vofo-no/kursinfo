import { sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";

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

export const SYNC_LOCK = sql`SELECT pg_advisory_xact_lock(hashtext('teacher-sync'))`;
