import { SQL, sql } from "drizzle-orm";
import {
  customType,
  date,
  foreignKey,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const tsVector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const teachers = pgTable(
  "teachers",
  {
    scope: text("scope").notNull(),
    id: text("id").notNull(),
    name: text("name").notNull(),
    redactedAt: timestamp("redacted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.scope, t.id] })],
);

export const teacherAliases = pgTable(
  "teacher_aliases",
  {
    scope: text("scope").notNull(),
    aliasId: text("alias_id").notNull(),
    teacherId: text("teacher_id").notNull(),
  },
  (t) => [primaryKey({ columns: [t.scope, t.aliasId] })],
);

export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id").notNull(),
    title: text("title").notNull(),
    curriculum: text("curriculum").notNull(),
    organizer: text("organizer").notNull(),
    county: text("county").notNull(),
    organization: text("organization").notNull(),
    teacherName: text("teacher_name").notNull(),
    contentSearch: tsVector("content_search").generatedAlwaysAs(
      (): SQL =>
        sql`to_tsvector('norwegian', ${courses.title} || ' ' || ${courses.curriculum} || ' ' || ${courses.organizer} || ' ' || ${courses.organization} || ' ' || ${courses.teacherName})`,
    ),
    date: date("date").notNull(),
    scope: text("scope").notNull(),
    teacherId: text("teacher_id")
      .notNull()
      .references(() => teachers.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    foreignKey({
      name: "courses_teacher_fk",
      columns: [t.scope, t.teacherId],
      foreignColumns: [teachers.scope, teachers.id],
    }),
    index("idx_scope_date").on(t.scope, t.date),
    index("idx_scope_teacher").on(t.scope, t.teacherId),
    index("idx_content_search").using("gin", t.contentSearch),
    index("idx_county").on(t.county),
    index("idx_organization").on(t.organization),
  ],
);

export const features = pgTable(
  "features",
  {
    name: text("name").notNull(),
    organizationId: text("organization_id").notNull(),
    settings: jsonb("settings")
      .notNull()
      .default(sql`'{}'::jsonb`),
  },
  (table) => [primaryKey({ columns: [table.name, table.organizationId] })],
);
