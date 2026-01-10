import { pgTable, uuid, text, integer, numeric, date, timestamp } from 'drizzle-orm/pg-core';
import { customerTypeEnum, orderStatusEnum, deliveryStatusEnum } from './shared.schema';
import { finishedGoodsItems } from './finished-goods.schema';
import { warehouses } from './warehouses.schema';

export const customers = pgTable('customers', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    type: customerTypeEnum('type').notNull(),
    contactPerson: text('contact_person'),
    phone: text('phone'),
    email: text('email'),
    billingAddress: text('billing_address'),
    shippingAddress: text('shipping_address'),
    taxId: text('tax_id'),
    status: text('status').default('Active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const salesOrders = pgTable('sales_orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    customerId: uuid('customer_id').references(() => customers.id).notNull(),
    orderDate: date('order_date').notNull(),
    deliveryDate: date('delivery_date'),
    status: orderStatusEnum('status').default('Draft'),
    totalAmount: numeric('total_amount').default('0'),
    createdBy: text('created_by'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const salesOrderItems = pgTable('sales_order_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    salesOrderId: uuid('sales_order_id').references(() => salesOrders.id).notNull(),
    itemId: uuid('item_id').references(() => finishedGoodsItems.id).notNull(),
    batchNumber: text('batch_number'),
    quantity: integer('quantity').notNull(),
    unitPrice: numeric('unit_price').notNull(),
    discount: numeric('discount').default('0'),
    tax: numeric('tax').default('0'),
    netAmount: numeric('net_amount').notNull(),
});

export const dispatches = pgTable('dispatches', {
    id: uuid('id').defaultRandom().primaryKey(),
    salesOrderId: uuid('sales_order_id').references(() => salesOrders.id).notNull(),
    warehouseId: uuid('warehouse_id').references(() => warehouses.id),
    dispatchDate: date('dispatch_date').defaultNow(),
    transporter: text('transporter'),
    deliveryStatus: deliveryStatusEnum('delivery_status').default('Pending'),
    createdAt: timestamp('created_at').defaultNow(),
});
