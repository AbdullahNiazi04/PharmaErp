import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateFinishedGoodDto } from './dto/create-finished-good.dto';
import { CreateFinishedGoodBatchDto } from './dto/create-batch.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { finishedGoodsItems, finishedGoodsBatches, trash } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class FinishedGoodsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  // --- Items CRUD ---
  async create(createDto: CreateFinishedGoodDto) {
    const [item] = await this.db.insert(finishedGoodsItems).values({
      itemCode: createDto.itemCode,
      itemName: createDto.itemName,
      dosageForm: createDto.dosageForm,
      strength: createDto.strength,
      packSize: createDto.packSize,
      shelfLife: createDto.shelfLife,
      mrp: createDto.mrp ? createDto.mrp.toString() : '0',
    }).returning();
    return item;
  }

  async findAll() {
    return await this.db.select().from(finishedGoodsItems);
  }

  async findOne(id: string) {
    const result = await this.db.select().from(finishedGoodsItems).where(eq(finishedGoodsItems.id, id));
    if (result.length === 0) throw new NotFoundException(`Item ${id} not found`);
    return result[0];
  }

  async update(id: string, updateDto: Partial<CreateFinishedGoodDto>) {
    await this.findOne(id);
    const [updated] = await this.db.update(finishedGoodsItems)
      .set({
        ...updateDto,
        mrp: updateDto.mrp ? updateDto.mrp.toString() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(finishedGoodsItems.id, id))
      .returning();
    return updated;
  }

  async remove(id: string) {
    const item = await this.findOne(id);
    await this.db.insert(trash).values({
      originalTable: 'finished_goods_items',
      originalId: id,
      data: item,
    });
    await this.db.delete(finishedGoodsItems).where(eq(finishedGoodsItems.id, id));
    return { message: 'Item moved to trash', id };
  }

  // --- Batches CRUD ---
  async addBatch(createDto: CreateFinishedGoodBatchDto) {
    const [batch] = await this.db.insert(finishedGoodsBatches).values({
      itemId: createDto.itemId,
      batchNumber: createDto.batchNumber,
      mfgDate: createDto.mfgDate,
      expiryDate: createDto.expiryDate,
      quantityProduced: createDto.quantityProduced,
      quantityAvailable: createDto.quantityProduced, // Initially same
      qcStatus: createDto.qcStatus || 'Hold',
      warehouseId: createDto.warehouseId,
    }).returning();
    return batch;
  }

  async getAllBatches() {
    return await this.db.select().from(finishedGoodsBatches);
  }

  async getBatches(itemId: string) {
    return await this.db.select().from(finishedGoodsBatches).where(eq(finishedGoodsBatches.itemId, itemId));
  }

  async findOneBatch(id: string) {
    const result = await this.db.select().from(finishedGoodsBatches).where(eq(finishedGoodsBatches.id, id));
    if (result.length === 0) throw new NotFoundException(`Batch ${id} not found`);
    return result[0];
  }

  async updateBatch(id: string, updateDto: Partial<CreateFinishedGoodBatchDto>) {
    await this.findOneBatch(id);
    const [updated] = await this.db.update(finishedGoodsBatches)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(eq(finishedGoodsBatches.id, id))
      .returning();
    return updated;
  }

  async removeBatch(id: string) {
    const batch = await this.findOneBatch(id);
    await this.db.insert(trash).values({
      originalTable: 'finished_goods_batches',
      originalId: id,
      data: batch,
    });
    await this.db.delete(finishedGoodsBatches).where(eq(finishedGoodsBatches.id, id));
    return { message: 'Batch moved to trash', id };
  }
}

