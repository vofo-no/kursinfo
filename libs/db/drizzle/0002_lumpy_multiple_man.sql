ALTER TABLE "courses" DROP COLUMN "content_search";--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "organization" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "teacher_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "content_search" "tsvector" GENERATED ALWAYS AS (to_tsvector('norwegian', "courses"."title" || ' ' || "courses"."curriculum" || ' ' || "courses"."organizer" || ' ' || "courses"."organization" || ' ' || "courses"."teacher_name")) STORED;--> statement-breakpoint
CREATE INDEX "idx_organization" ON "courses" USING btree ("organization");--> statement-breakpoint
CREATE INDEX "idx_content_search" ON "courses" USING gin ("content_search");