import { pgTable, uuid, text, boolean, integer, numeric, date, timestamp } from 'drizzle-orm/pg-core';
import { prPriorityEnum, prStatusEnum, poStatusEnum, qcStatusEnum, grnStatusEnum } from './shared.schema';
import { vendors } from './vendors.schema';

// --- PURCHASE REQUISITIONS ---
export const purchaseRequisitions = pgTable('purchase_requisitions', {
    id: uuid('id').defaultRandom().primaryKey(),
    reqNumber: text('req_number').notNull().unique(),
    requisitionDate: date('requisition_date').notNull(),
    requestedBy: text('requested_by').notNull(),
    department: text('department'),
    costCenter: text('cost_center'),
    priority: prPriorityEnum('priority').default('Normal'),
    expectedDeliveryDate: date('expected_delivery_date'),
    budgetReference: text('budget_reference'),

    status: prStatusEnum('status').default('Draft'),
    totalEstimatedCost: numeric('total_estimated_cost'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const purchaseRequisitionItems = pgTable('purchase_requisition_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    prId: uuid('pr_id').references(() => purchaseRequisitions.id).notNull(),
    itemCode: text('item_code'),
    itemName: text('item_name').notNull(),
    category: text('category'),
    uom: text('uom'),
    quantity: integer('quantity').notNull(),
    estimatedUnitCost: numeric('estimated_unit_cost'),
    totalCost: numeric('total_cost'),
    preferredVendorId: uuid('preferred_vendor_id').references(() => vendors.id),
    specification: text('specification'),
});

// --- PURCHASE ORDERS ---
export const purchaseOrders = pgTable('purchase_orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    poNumber: text('po_number').notNull().unique(),
    poDate: date('po_date').notNull(),
    vendorId: uuid('vendor_id').references(() => vendors.id).notNull(),
    referencePrId: uuid('reference_pr_id').references(() => purchaseRequisitions.id),
    currency: text('currency').default('PKR'),
    paymentTerms: text('payment_terms'),
    incoterms: text('incoterms'),
    deliverySchedule: date('delivery_schedule'),
    deliveryLocation: text('delivery_location'),

    // Financials
    freightCharges: numeric('freight_charges').default('0'),
    insuranceCharges: numeric('insurance_charges').default('0'),
    subtotal: numeric('subtotal').default('0'),
    taxAmount: numeric('tax_amount').default('0'),
    totalAmount: numeric('total_amount').default('0'),

    status: poStatusEnum('status').default('Draft'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const purchaseOrderItems = pgTable('purchase_order_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    poId: uuid('po_id').references(() => purchaseOrders.id).notNull(),
    itemCode: text('item_code'),
    description: text('description'),
    quantity: integer('quantity').notNull(),
    unitPrice: numeric('unit_price').notNull(),
    discountPercent: numeric('discount_percent').default('0'),
    taxPercent: numeric('tax_percent').default('0'),
    netAmount: numeric('net_amount'),
    totalAmount: numeric('total_amount'),
    isBatchRequired: boolean('is_batch_required').default(false),
});

// --- GOODS RECEIPT NOTES ---
export const goodsReceiptNotes = pgTable('goods_receipt_notes', {
    id: uuid('id').defaultRandom().primaryKey(),
    grnNumber: text('grn_number').notNull().unique(),
    grnDate: date('grn_date').notNull(),
    poId: uuid('po_id').references(() => purchaseOrders.id),
    warehouseLocation: text('warehouse_location'),
    receivedBy: text('received_by'),

    // QC & Inventory
    qcRequired: boolean('qc_required').default(false),
    qcStatus: qcStatusEnum('qc_status').default('Pending'),
    qcRemarks: text('qc_remarks'),

    stockPosted: boolean('stock_posted').default(false),
    inventoryLocation: text('inventory_location'),

    status: grnStatusEnum('status').default('Draft'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const goodsReceiptItems = pgTable('goods_receipt_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    grnId: uuid('grn_id').references(() => goodsReceiptNotes.id).notNull(),
    itemCode: text('item_code'),
    itemName: text('item_name'),
    orderedQty: integer('ordered_qty').notNull(),
    receivedQty: integer('received_qty').notNull(),
    rejectedQty: integer('rejected_qty').default(0),

    batchNumber: text('batch_number'),
    mfgDate: date('mfg_date'),
    expiryDate: date('expiry_date'),
    storageCondition: text('storage_condition'),
});
