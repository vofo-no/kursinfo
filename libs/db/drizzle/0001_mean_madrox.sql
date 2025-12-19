CREATE TABLE "features" (
	"name" text NOT NULL,
	"organization_id" text NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	CONSTRAINT "features_name_organization_id_pk" PRIMARY KEY("name","organization_id")
);
