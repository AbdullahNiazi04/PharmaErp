import { pgTable, uuid, text, boolean, numeric, timestamp } from 'drizzle-orm/pg-core';
import { warehouseTypeEnum, fgStatusEnum } from './shared.schema';

export const warehouses = pgTable('warehouses', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    type: warehouseTypeEnum('type').default('Normal'),
    location: text('location'),
    temperatureRange: text('temperature_range'),
    humidityRange: text('humidity_range'),
    status: fgStatusEnum('status').default('Active'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const coldChainLogs = pgTable('cold_chain_logs', {
    id: uuid('id').defaultRandom().primaryKey(),
    warehouseId: uuid('warehouse_id').references(() => warehouses.id).notNull(),
    temperature: numeric('temperature'),
    humidity: numeric('humidity'),
    recordedAt: timestamp('recorded_at').defaultNow(),
    alertTriggered: boolean('alert_triggered').default(false),
});
