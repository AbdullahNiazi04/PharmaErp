import { pgTable, uuid, text, numeric, date, timestamp } from 'drizzle-orm/pg-core';
import { invoiceStatusEnum, paymentMethodEnum, paymentStatusEnum } from './shared.schema';
import { vendors } from './vendors.schema';
import { purchaseOrders, goodsReceiptNotes } from './procurement.schema';

export const invoices = pgTable('invoices', {
    id: uuid('id').defaultRandom().primaryKey(),
    invoiceNumber: text('invoice_number').notNull().unique(),
    invoiceDate: date('invoice_date').notNull(),
    vendorId: uuid('vendor_id').references(() => vendors.id).notNull(),
    poId: uuid('po_id').references(() => purchaseOrders.id),
    grnId: uuid('grn_id').references(() => goodsReceiptNotes.id),

    amount: numeric('amount').notNull(),
    dueDate: date('due_date').notNull(),
    status: invoiceStatusEnum('status').default('Pending'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const payments = pgTable('payments', {
    id: uuid('id').defaultRandom().primaryKey(),
    invoiceId: uuid('invoice_id').references(() => invoices.id).notNull(),
    paymentDate: date('payment_date').notNull(),
    paymentMethod: paymentMethodEnum('payment_method').default('Bank Transfer'),

    amountPaid: numeric('amount_paid').notNull(),
    taxWithheld: numeric('tax_withheld').default('0'),
    advanceAdjustments: numeric('advance_adjustments').default('0'),

    paymentReference: text('payment_reference'),
    status: paymentStatusEnum('status').default('Pending'),

    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
