import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  jsonb,
} from 'drizzle-orm/pg-core';

// --- SHARED ENUMS ---
// Vendor
export const vendorTypeEnum = pgEnum('vendor_type', [
  'Raw Material',
  'Packaging',
  'Services',
  'Equipment',
]);
export const vendorStatusEnum = pgEnum('vendor_status', [
  'Active',
  'Inactive',
  'Blacklisted',
]);
export const auditStatusEnum = pgEnum('audit_status', [
  'Pending',
  'Cleared',
  'Failed',
]);
export const riskCategoryEnum = pgEnum('risk_category', [
  'Low',
  'Medium',
  'High',
]);
export const paymentTermsEnum = pgEnum('payment_terms', [
  'Net-30',
  'Net-60',
  'Advanced',
]);

// Procurement
export const prStatusEnum = pgEnum('pr_status', [
  'Draft',
  'Pending Approval',
  'Approved',
  'Rejected',
  'Converted',
]);
export const prPriorityEnum = pgEnum('pr_priority', ['Normal', 'Urgent']);
export const poStatusEnum = pgEnum('po_status', [
  'Draft',
  'Issued',
  'Partial',
  'Closed',
  'Cancelled',
]);
export const qcStatusEnum = pgEnum('qc_status', [
  'Pending',
  'Passed',
  'Failed',
  'Skipped',
]);
export const grnStatusEnum = pgEnum('grn_status', [
  'Draft',
  'Submitted',
  'Approved',
]);
export const taxCategoryEnum = pgEnum('tax_category', [
  'Inclusive',
  'Exclusive',
]);
export const qcUrgencyEnum = pgEnum('qc_urgency', ['Normal', 'Urgent', 'ASAP']);

// Finance
export const paymentMethodEnum = pgEnum('payment_method', [
  'Bank Transfer',
  'Cheque',
  'Cash',
  'Credit Card',
]);
export const paymentStatusEnum = pgEnum('payment_status', [
  'Pending',
  'Completed',
  'Failed',
]);
export const invoiceStatusEnum = pgEnum('invoice_status', [
  'Pending',
  'Paid',
  'Overdue',
  'Cancelled',
]);

// Inventory - Raw Materials
export const rawMaterialTypeEnum = pgEnum('raw_material_type', [
  'API',
  'Excipient',
  'Packaging',
]);
export const rmStatusEnum = pgEnum('rm_status', ['Active', 'Inactive']);
export const batchStatusEnum = pgEnum('batch_status', [
  'Quarantine',
  'Approved',
  'Rejected',
]);

// Inventory - Finished Goods & Warehouses
export const warehouseTypeEnum = pgEnum('warehouse_type', [
  'Normal',
  'Cold Chain',
]);
export const fgStatusEnum = pgEnum('fg_status', ['Active', 'Inactive']);
export const qcReleaseStatusEnum = pgEnum('qc_release_status', [
  'Released',
  'Hold',
  'Rejected',
]);

// Sales
export const customerTypeEnum = pgEnum('customer_type', [
  'Distributor',
  'Hospital',
  'Pharmacy',
]);
export const orderStatusEnum = pgEnum('order_status', [
  'Draft',
  'Confirmed',
  'Dispatched',
  'Cancelled',
]);
export const deliveryStatusEnum = pgEnum('delivery_status', [
  'Pending',
  'In-Transit',
  'Delivered',
]);

// --- GLOBAL TRASH BIN ---
export const trash = pgTable('trash', {
  id: uuid('id').defaultRandom().primaryKey(),
  originalTable: text('original_table').notNull(),
  originalId: uuid('original_id').notNull(),
  data: jsonb('data').notNull(),
  deletedAt: timestamp('deleted_at').defaultNow(),
});
