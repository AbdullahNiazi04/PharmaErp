CREATE TYPE "public"."batch_status" AS ENUM('Quarantine', 'Approved', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."raw_material_type" AS ENUM('API', 'Excipient', 'Packaging');--> statement-breakpoint
CREATE TYPE "public"."rm_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TABLE "raw_material_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inventory_id" uuid NOT NULL,
	"batch_number" text NOT NULL,
	"quantity_available" integer NOT NULL,
	"expiry_date" date,
	"qc_status" "batch_status" DEFAULT 'Quarantine',
	"warehouse_location" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raw_material_inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"material_id" uuid NOT NULL,
	"storage_condition" text,
	"reorder_level" integer DEFAULT 0,
	"safety_stock" integer DEFAULT 0,
	"status" "rm_status" DEFAULT 'Active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "raw_materials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"type" "raw_material_type" NOT NULL,
	"unit_of_measure" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "raw_materials_name_unique" UNIQUE("name"),
	CONSTRAINT "raw_materials_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "raw_material_batches" ADD CONSTRAINT "raw_material_batches_inventory_id_raw_material_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."raw_material_inventory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "raw_material_inventory" ADD CONSTRAINT "raw_material_inventory_material_id_raw_materials_id_fk" FOREIGN KEY ("material_id") REFERENCES "public"."raw_materials"("id") ON DELETE no action ON UPDATE no action;