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

  // === Raw Material Master ===
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

  async update(id: string, updateDto: Partial<CreateRawMaterialDto>) {
    const existing = await this.findOne(id);
    const [updated] = await this.db.update(rawMaterials)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(eq(rawMaterials.id, id))
      .returning();
    return updated;
  }

  async remove(id: string) {
    const mat = await this.findOne(id);
    await this.db.insert(trash).values({
      originalTable: 'raw_materials',
      originalId: id,
      data: mat,
    });
    await this.db.delete(rawMaterials).where(eq(rawMaterials.id, id));
    return { message: 'Material moved to trash', id };
  }

  // === Inventory Settings ===
  async findAllInventory() {
    return await this.db.select().from(rawMaterialInventory);
  }

  async findOneInventory(id: string) {
    const result = await this.db.select().from(rawMaterialInventory).where(eq(rawMaterialInventory.id, id));
    if (result.length === 0) throw new NotFoundException(`Inventory config ${id} not found`);
    return result[0];
  }

  async createInventoryConfig(createDto: CreateRawMaterialInventoryDto) {
    const [config] = await this.db.insert(rawMaterialInventory).values({
      materialId: createDto.materialId,
      storageCondition: createDto.storageCondition,
      reorderLevel: createDto.reorderLevel,
      safetyStock: createDto.safetyStock,
    }).returning();
    return config;
  }

  async updateInventory(id: string, updateDto: Partial<CreateRawMaterialInventoryDto>) {
    await this.findOneInventory(id);
    const [updated] = await this.db.update(rawMaterialInventory)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(eq(rawMaterialInventory.id, id))
      .returning();
    return updated;
  }

  async removeInventory(id: string) {
    const inv = await this.findOneInventory(id);
    await this.db.insert(trash).values({
      originalTable: 'raw_material_inventory',
      originalId: id,
      data: inv,
    });
    await this.db.delete(rawMaterialInventory).where(eq(rawMaterialInventory.id, id));
    return { message: 'Inventory config moved to trash', id };
  }

  // === Batch Management ===
  async findAllBatches() {
    return await this.db.select().from(rawMaterialBatches);
  }

  async findOneBatch(id: string) {
    const result = await this.db.select().from(rawMaterialBatches).where(eq(rawMaterialBatches.id, id));
    if (result.length === 0) throw new NotFoundException(`Batch ${id} not found`);
    return result[0];
  }

  async getBatches(inventoryId: string) {
    return await this.db.select().from(rawMaterialBatches).where(eq(rawMaterialBatches.inventoryId, inventoryId));
  }

  async addBatch(createDto: CreateRawMaterialBatchDto) {
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

  async updateBatch(id: string, updateDto: Partial<CreateRawMaterialBatchDto>) {
    await this.findOneBatch(id);
    const [updated] = await this.db.update(rawMaterialBatches)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(eq(rawMaterialBatches.id, id))
      .returning();
    return updated;
  }

  async removeBatch(id: string) {
    const batch = await this.findOneBatch(id);
    await this.db.insert(trash).values({
      originalTable: 'raw_material_batches',
      originalId: id,
      data: batch,
    });
    await this.db.delete(rawMaterialBatches).where(eq(rawMaterialBatches.id, id));
    return { message: 'Batch moved to trash', id };
  }
}
