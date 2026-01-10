CREATE TYPE "public"."audit_status" AS ENUM('Pending', 'Cleared', 'Failed');--> statement-breakpoint
CREATE TYPE "public"."invoice_status" AS ENUM('Pending', 'Paid');--> statement-breakpoint
CREATE TYPE "public"."payment_terms" AS ENUM('Net-30', 'Net-60', 'Advanced');--> statement-breakpoint
CREATE TYPE "public"."po_status" AS ENUM('Open', 'Closed', 'Partial');--> statement-breakpoint
CREATE TYPE "public"."pr_status" AS ENUM('Open', 'Converted', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."risk_category" AS ENUM('Low', 'Medium', 'High');--> statement-breakpoint
CREATE TYPE "public"."vendor_status" AS ENUM('Active', 'Inactive', 'Blacklisted');--> statement-breakpoint
CREATE TYPE "public"."vendor_type" AS ENUM('Raw Material', 'Packaging', 'Services', 'Equipment');--> statement-breakpoint
CREATE TABLE "invoices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inv_number" text NOT NULL,
	"po_id" uuid,
	"amount" numeric,
	"status" "invoice_status" DEFAULT 'Pending',
	"due_date" date,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "invoices_inv_number_unique" UNIQUE("inv_number")
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"po_number" text NOT NULL,
	"vendor_id" uuid,
	"total_amount" numeric,
	"currency" text DEFAULT 'PKR',
	"status" "po_status" DEFAULT 'Open',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "purchase_orders_po_number_unique" UNIQUE("po_number")
);
--> statement-breakpoint
CREATE TABLE "purchase_requisitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"req_number" text NOT NULL,
	"status" "pr_status" DEFAULT 'Open',
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "purchase_requisitions_req_number_unique" UNIQUE("req_number")
);
--> statement-breakpoint
CREATE TABLE "trash" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_table" text NOT NULL,
	"original_id" uuid NOT NULL,
	"data" jsonb NOT NULL,
	"deleted_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"legal_name" text NOT NULL,
	"vendor_type" "vendor_type",
	"business_category" text,
	"registration_number" text,
	"ntn_vat_gst" text,
	"country" text,
	"city" text,
	"address" text,
	"status" "vendor_status" DEFAULT 'Active',
	"contact_person" text,
	"contact_number" text,
	"email" text,
	"website" text,
	"is_gmp_certified" boolean DEFAULT false,
	"is_blacklisted" boolean DEFAULT false,
	"regulatory_license" text,
	"license_expiry_date" date,
	"quality_rating" integer,
	"audit_status" "audit_status" DEFAULT 'Pending',
	"risk_category" "risk_category" DEFAULT 'Low',
	"bank_name" text,
	"account_title" text,
	"account_number" text,
	"currency" text DEFAULT 'PKR',
	"payment_terms" "payment_terms",
	"credit_limit" numeric,
	"tax_withholding_percent" numeric,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_po_id_purchase_orders_id_fk" FOREIGN KEY ("po_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;