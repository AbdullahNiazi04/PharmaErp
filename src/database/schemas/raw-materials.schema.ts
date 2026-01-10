import { pgTable, uuid, text, integer, date, timestamp } from 'drizzle-orm/pg-core';
import { rawMaterialTypeEnum, rmStatusEnum, batchStatusEnum } from './shared.schema';

export const rawMaterials = pgTable('raw_materials', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    code: text('code').notNull().unique(),
    description: text('description'),
    type: rawMaterialTypeEnum('type').notNull(),
    unitOfMeasure: text('unit_of_measure').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const rawMaterialInventory = pgTable('raw_material_inventory', {
    id: uuid('id').defaultRandom().primaryKey(),
    materialId: uuid('material_id').references(() => rawMaterials.id).notNull(),
    storageCondition: text('storage_condition'),
    reorderLevel: integer('reorder_level').default(0),
    safetyStock: integer('safety_stock').default(0),
    status: rmStatusEnum('status').default('Active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const rawMaterialBatches = pgTable('raw_material_batches', {
    id: uuid('id').defaultRandom().primaryKey(),
    inventoryId: uuid('inventory_id').references(() => rawMaterialInventory.id).notNull(),
    batchNumber: text('batch_number').notNull(),
    quantityAvailable: integer('quantity_available').notNull(),
    expiryDate: date('expiry_date'),
    qcStatus: batchStatusEnum('qc_status').default('Quarantine'),
    warehouseLocation: text('warehouse_location'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});
