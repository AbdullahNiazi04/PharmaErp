import { pgTable, uuid, text, integer, numeric, date, timestamp } from 'drizzle-orm/pg-core';
import { fgStatusEnum, qcReleaseStatusEnum } from './shared.schema';
import { warehouses } from './warehouses.schema';

export const finishedGoodsItems = pgTable('finished_goods_items', {
    id: uuid('id').defaultRandom().primaryKey(),
    itemCode: text('item_code').notNull().unique(),
    itemName: text('item_name').notNull(),
    dosageForm: text('dosage_form'),
    strength: text('strength'),
    packSize: text('pack_size'),
    shelfLife: integer('shelf_life'),
    mrp: numeric('mrp').default('0'),
    status: fgStatusEnum('status').default('Active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const finishedGoodsBatches = pgTable('finished_goods_batches', {
    id: uuid('id').defaultRandom().primaryKey(),
    itemId: uuid('item_id').references(() => finishedGoodsItems.id).notNull(),
    batchNumber: text('batch_number').notNull(),
    mfgDate: date('mfg_date').notNull(),
    expiryDate: date('expiry_date').notNull(),
    quantityProduced: integer('quantity_produced').notNull(),
    quantityAvailable: integer('quantity_available').notNull(),
    qcStatus: qcReleaseStatusEnum('qc_status').default('Hold'),
    warehouseId: uuid('warehouse_id').references(() => warehouses.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
