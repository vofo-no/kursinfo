import { SQL, sql } from "drizzle-orm";
import {
  customType,
  date,
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

export const teachers = pgTable("teachers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const courses = pgTable(
  "courses",
  {
    id: serial("id").primaryKey(),
    courseId: integer("course_id").notNull(),
    title: text("title").notNull(),
    curriculum: text("curriculum").notNull(),
    organizer: text("organizer").notNull(),
    county: text("county").notNull(),
    contentSearch: tsVector("content_search").generatedAlwaysAs(
      (): SQL =>
        sql`to_tsvector('norwegian', ${courses.title} || ' ' || ${courses.curriculum} || ' ' || ${courses.organizer})`,
    ),
    date: date("date").notNull(),
    scope: text("scope").notNull(),
    teacherId: text("teacher_id").references(() => teachers.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("idx_content_search").using("gin", t.contentSearch),
    index("idx_county").on(t.county),
    index("idx_date").on(t.date),
    index("idx_scope").on(t.scope),
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
