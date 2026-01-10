CREATE TYPE "public"."payment_method" AS ENUM('Bank Transfer', 'Cheque', 'Cash', 'Credit Card');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('Pending', 'Completed', 'Failed');--> statement-breakpoint
ALTER TYPE "public"."invoice_status" ADD VALUE 'Overdue';--> statement-breakpoint
ALTER TYPE "public"."invoice_status" ADD VALUE 'Cancelled';--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invoice_id" uuid NOT NULL,
	"payment_date" date NOT NULL,
	"payment_method" "payment_method" DEFAULT 'Bank Transfer',
	"amount_paid" numeric NOT NULL,
	"tax_withheld" numeric DEFAULT '0',
	"advance_adjustments" numeric DEFAULT '0',
	"payment_reference" text,
	"status" "payment_status" DEFAULT 'Pending',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_inv_number_unique";--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "amount" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ALTER COLUMN "due_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoice_number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoice_date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "vendor_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "grn_id" uuid;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_grn_id_goods_receipt_notes_id_fk" FOREIGN KEY ("grn_id") REFERENCES "public"."goods_receipt_notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "inv_number";--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number");