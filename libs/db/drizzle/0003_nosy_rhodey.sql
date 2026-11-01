CREATE TABLE "teacher_aliases" (
    "scope" text NOT NULL,
    "alias_id" text NOT NULL,
    "teacher_id" text NOT NULL,
    CONSTRAINT "teacher_aliases_scope_alias_id_pk" PRIMARY KEY("scope","alias_id")
);
--> statement-breakpoint
ALTER TABLE "courses" DROP CONSTRAINT "courses_teacher_id_teachers_id_fk";--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_pkey";--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "scope" text NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "redacted_at" timestamp;--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_scope_id_pk" PRIMARY KEY("scope","id");--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "teacher_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_fk" FOREIGN KEY ("scope","teacher_id") REFERENCES "public"."teachers"("scope","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP INDEX "idx_date";--> statement-breakpoint
DROP INDEX "idx_scope";--> statement-breakpoint
CREATE INDEX "idx_scope_date" ON "courses" USING btree ("scope","date");--> statement-breakpoint
CREATE INDEX "idx_scope_teacher" ON "courses" USING btree ("scope","teacher_id");