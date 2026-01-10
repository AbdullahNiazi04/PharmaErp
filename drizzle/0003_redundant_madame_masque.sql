CREATE TYPE "public"."grn_status" AS ENUM('Draft', 'Submitted', 'Approved');--> statement-breakpoint
CREATE TYPE "public"."qc_status" AS ENUM('Pending', 'Passed', 'Failed', 'Skipped');--> statement-breakpoint
CREATE TABLE "goods_receipt_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grn_id" uuid NOT NULL,
	"item_code" text,
	"item_name" text,
	"ordered_qty" integer NOT NULL,
	"received_qty" integer NOT NULL,
	"rejected_qty" integer DEFAULT 0,
	"batch_number" text,
	"mfg_date" date,
	"expiry_date" date,
	"storage_condition" text
);
--> statement-breakpoint
CREATE TABLE "goods_receipt_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"grn_number" text NOT NULL,
	"grn_date" date NOT NULL,
	"po_id" uuid,
	"warehouse_location" text,
	"received_by" text,
	"qc_required" boolean DEFAULT false,
	"qc_status" "qc_status" DEFAULT 'Pending',
	"qc_remarks" text,
	"stock_posted" boolean DEFAULT false,
	"inventory_location" text,
	"status" "grn_status" DEFAULT 'Draft',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "goods_receipt_notes_grn_number_unique" UNIQUE("grn_number")
);
--> statement-breakpoint
ALTER TABLE "goods_receipt_items" ADD CONSTRAINT "goods_receipt_items_grn_id_goods_receipt_notes_id_fk" FOREIGN KEY ("grn_id") REFERENCES "public"."goods_receipt_notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goods_receipt_notes" ADD CONSTRAINT "goods_receipt_notes_po_id_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;