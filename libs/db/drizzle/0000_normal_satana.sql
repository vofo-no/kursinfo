CREATE TABLE "courses" (
	"id" serial PRIMARY KEY NOT NULL,
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"curriculum" text NOT NULL,
	"organizer" text NOT NULL,
	"county" text NOT NULL,
	"content_search" "tsvector" GENERATED ALWAYS AS (to_tsvector('norwegian', "courses"."title" || ' ' || "courses"."curriculum" || ' ' || "courses"."organizer")) STORED,
	"date" date NOT NULL,
	"scope" text NOT NULL,
	"teacher_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teachers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "courses" ADD CONSTRAINT "courses_teacher_id_teachers_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."teachers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_content_search" ON "courses" USING gin ("content_search");--> statement-breakpoint
CREATE INDEX "idx_county" ON "courses" USING btree ("county");--> statement-breakpoint
CREATE INDEX "idx_date" ON "courses" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_scope" ON "courses" USING btree ("scope");