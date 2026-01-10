CREATE TABLE "purchase_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"po_id" uuid NOT NULL,
	"item_code" text,
	"description" text,
	"quantity" integer NOT NULL,
	"unit_price" numeric NOT NULL,
	"discount_percent" numeric DEFAULT '0',
	"tax_percent" numeric DEFAULT '0',
	"net_amount" numeric,
	"total_amount" numeric,
	"is_batch_required" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "status" SET DEFAULT 'Draft'::text;--> statement-breakpoint
DROP TYPE "public"."po_status";--> statement-breakpoint
CREATE TYPE "public"."po_status" AS ENUM('Draft', 'Issued', 'Partial', 'Closed', 'Cancelled');--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "status" SET DEFAULT 'Draft'::"public"."po_status";--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "status" SET DATA TYPE "public"."po_status" USING "status"::"public"."po_status";--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "vendor_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_orders" ALTER COLUMN "total_amount" SET DEFAULT '0';--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "po_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "reference_pr_id" uuid;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "payment_terms" text;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "incoterms" text;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "delivery_schedule" date;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "delivery_location" text;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "freight_charges" numeric DEFAULT '0';--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "insurance_charges" numeric DEFAULT '0';--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "subtotal" numeric DEFAULT '0';--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "tax_amount" numeric DEFAULT '0';--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_po_id_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_reference_pr_id_purchase_requisitions_id_fk" FOREIGN KEY ("reference_pr_id") REFERENCES "public"."purchase_requisitions"("id") ON DELETE no action ON UPDATE no action;