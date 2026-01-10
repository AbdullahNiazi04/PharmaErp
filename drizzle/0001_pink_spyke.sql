CREATE TYPE "public"."pr_priority" AS ENUM('Normal', 'Urgent');--> statement-breakpoint
CREATE TABLE "purchase_requisition_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pr_id" uuid NOT NULL,
	"item_code" text,
	"item_name" text NOT NULL,
	"category" text,
	"uom" text,
	"quantity" integer NOT NULL,
	"estimated_unit_cost" numeric,
	"total_cost" numeric,
	"preferred_vendor_id" uuid,
	"specification" text
);
--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ALTER COLUMN "status" SET DEFAULT 'Draft'::text;--> statement-breakpoint
DROP TYPE "public"."pr_status";--> statement-breakpoint
CREATE TYPE "public"."pr_status" AS ENUM('Draft', 'Pending Approval', 'Approved', 'Rejected', 'Converted');--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ALTER COLUMN "status" SET DEFAULT 'Draft'::"public"."pr_status";--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ALTER COLUMN "status" SET DATA TYPE "public"."pr_status" USING "status"::"public"."pr_status";--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD COLUMN "requisition_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD COLUMN "requested_by" text NOT NULL;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD COLUMN "department" text;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD COLUMN "cost_center" text;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD COLUMN "priority" "pr_priority" DEFAULT 'Normal';--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD COLUMN "expected_delivery_date" date;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD COLUMN "budget_reference" text;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD COLUMN "total_estimated_cost" numeric;--> statement-breakpoint
ALTER TABLE "purchase_requisitions" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "purchase_requisition_items" ADD CONSTRAINT "purchase_requisition_items_pr_id_purchase_requisitions_id_fk" FOREIGN KEY ("pr_id") REFERENCES "public"."purchase_requisitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_requisition_items" ADD CONSTRAINT "purchase_requisition_items_preferred_vendor_id_vendors_id_fk" FOREIGN KEY ("preferred_vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;