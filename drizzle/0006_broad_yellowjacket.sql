CREATE TYPE "public"."fg_status" AS ENUM('Active', 'Inactive');--> statement-breakpoint
CREATE TYPE "public"."qc_release_status" AS ENUM('Released', 'Hold', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."warehouse_type" AS ENUM('Normal', 'Cold Chain');--> statement-breakpoint
CREATE TABLE "cold_chain_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"temperature" numeric,
	"humidity" numeric,
	"recorded_at" timestamp DEFAULT now(),
	"alert_triggered" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "finished_goods_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"batch_number" text NOT NULL,
	"mfg_date" date NOT NULL,
	"expiry_date" date NOT NULL,
	"quantity_produced" integer NOT NULL,
	"quantity_available" integer NOT NULL,
	"qc_status" "qc_release_status" DEFAULT 'Hold',
	"warehouse_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "finished_goods_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_code" text NOT NULL,
	"item_name" text NOT NULL,
	"dosage_form" text,
	"strength" text,
	"pack_size" text,
	"shelf_life" integer,
	"mrp" numeric DEFAULT '0',
	"status" "fg_status" DEFAULT 'Active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "finished_goods_items_item_code_unique" UNIQUE("item_code")
);
--> statement-breakpoint
CREATE TABLE "warehouses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "warehouse_type" DEFAULT 'Normal',
	"location" text,
	"temperature_range" text,
	"humidity_range" text,
	"status" "fg_status" DEFAULT 'Active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "warehouses_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "cold_chain_logs" ADD CONSTRAINT "cold_chain_logs_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finished_goods_batches" ADD CONSTRAINT "finished_goods_batches_item_id_finished_goods_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."finished_goods_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "finished_goods_batches" ADD CONSTRAINT "finished_goods_batches_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;