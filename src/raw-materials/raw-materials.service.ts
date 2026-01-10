import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateRawMaterialDto, CreateRawMaterialInventoryDto } from './dto/create-raw-material.dto';
import { CreateRawMaterialBatchDto } from './dto/create-batch.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { rawMaterials, rawMaterialInventory, rawMaterialBatches, trash } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class RawMaterialsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  // --- Raw Material Master ---
  async create(createDto: CreateRawMaterialDto) {
    const [newMaterial] = await this.db.insert(rawMaterials).values({
      name: createDto.name,
      code: createDto.code,
      description: createDto.description,
      type: createDto.type,
      unitOfMeasure: createDto.unitOfMeasure,
    }).returning();
    return newMaterial;
  }

  async findAll() {
    return await this.db.select().from(rawMaterials);
  }

  async findOne(id: string) {
    const result = await this.db.select().from(rawMaterials).where(eq(rawMaterials.id, id));
    if (result.length === 0) throw new NotFoundException(`Material ${id} not found`);
    return result[0];
  }

  // --- Inventory Settings ---
  async createInventoryConfig(createDto: CreateRawMaterialInventoryDto) {
    const [config] = await this.db.insert(rawMaterialInventory).values({
      materialId: createDto.materialId,
      storageCondition: createDto.storageCondition,
      reorderLevel: createDto.reorderLevel,
      safetyStock: createDto.safetyStock,
    }).returning();
    return config;
  }

  // --- Batch Management ---
  async addBatch(createDto: CreateRawMaterialBatchDto) {
    // 1. Check if inventory config exists, if not create one? 
    // For now assuming it exists or we query it. 
    // Actually schema links batch to Inventory ID. So we need that ID.

    // If user passes Inventory ID directly:
    const [batch] = await this.db.insert(rawMaterialBatches).values({
      inventoryId: createDto.inventoryId,
      batchNumber: createDto.batchNumber,
      quantityAvailable: createDto.quantityAvailable,
      expiryDate: createDto.expiryDate,
      qcStatus: createDto.qcStatus || 'Quarantine',
      warehouseLocation: createDto.warehouseLocation,
    }).returning();
    return batch;
  }

  async getBatches(inventoryId: string) {
    return await this.db.select().from(rawMaterialBatches).where(eq(rawMaterialBatches.inventoryId, inventoryId));
  }

  async remove(id: string) {
    const mat = await this.findOne(id);
    await this.db.insert(trash).values({
      originalTable: 'raw_materials',
      originalId: id,
      data: mat,
    });
    // cascade delete or handle relations manually
    await this.db.delete(rawMaterials).where(eq(rawMaterials.id, id));
    return { message: 'Material moved to trash', id };
  }
}
