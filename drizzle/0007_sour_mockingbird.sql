CREATE TYPE "public"."customer_type" AS ENUM('Distributor', 'Hospital', 'Pharmacy');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('Pending', 'In-Transit', 'Delivered');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('Draft', 'Confirmed', 'Dispatched', 'Cancelled');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "customer_type" NOT NULL,
	"contact_person" text,
	"phone" text,
	"email" text,
	"billing_address" text,
	"shipping_address" text,
	"tax_id" text,
	"status" text DEFAULT 'Active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "dispatches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sales_order_id" uuid NOT NULL,
	"warehouse_id" uuid,
	"dispatch_date" date DEFAULT now(),
	"transporter" text,
	"delivery_status" "delivery_status" DEFAULT 'Pending',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sales_order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sales_order_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"batch_number" text,
	"quantity" integer NOT NULL,
	"unit_price" numeric NOT NULL,
	"discount" numeric DEFAULT '0',
	"tax" numeric DEFAULT '0',
	"net_amount" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sales_orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"customer_id" uuid NOT NULL,
	"order_date" date NOT NULL,
	"delivery_date" date,
	"status" "order_status" DEFAULT 'Draft',
	"total_amount" numeric DEFAULT '0',
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_sales_order_id_sales_orders_id_fk" FOREIGN KEY ("sales_order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dispatches" ADD CONSTRAINT "dispatches_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_sales_order_id_sales_orders_id_fk" FOREIGN KEY ("sales_order_id") REFERENCES "public"."sales_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_order_items" ADD CONSTRAINT "sales_order_items_item_id_finished_goods_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."finished_goods_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD CONSTRAINT "sales_orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;