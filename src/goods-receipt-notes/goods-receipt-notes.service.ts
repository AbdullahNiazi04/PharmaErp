import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateGoodsReceiptNoteDto } from './dto/create-goods-receipt-note.dto';
import { UpdateGoodsReceiptNoteDto } from './dto/update-goods-receipt-note.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { goodsReceiptNotes, goodsReceiptItems, trash } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class GoodsReceiptNotesService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  async create(createDto: CreateGoodsReceiptNoteDto) {
    return await this.db.transaction(async (tx) => {
      // 1. Insert Header
      const [newGrn] = await tx.insert(goodsReceiptNotes).values({
        grnNumber: createDto.grnNumber,
        grnDate: createDto.grnDate,
        poId: createDto.poId,
        warehouseLocation: createDto.warehouseLocation,
        receivedBy: createDto.receivedBy,
        qcRequired: createDto.qcRequired ?? false, // Default to false if not provided
        qcStatus: createDto.qcRequired ? 'Pending' : 'Skipped', // Logic: Pending if QC needed, else Skipped
        qcRemarks: createDto.qcRemarks,
        stockPosted: createDto.stockPosted ?? false,
        inventoryLocation: createDto.inventoryLocation,
        status: 'Draft',
      }).returning();

      // 2. Insert Items
      if (createDto.items && createDto.items.length > 0) {
        const itemsToInsert = createDto.items.map(item => ({
          grnId: newGrn.id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          orderedQty: item.orderedQty,
          receivedQty: item.receivedQty,
          rejectedQty: item.rejectedQty || 0,
          batchNumber: item.batchNumber,
          mfgDate: item.mfgDate ? item.mfgDate : null,
          expiryDate: item.expiryDate ? item.expiryDate : null,
          storageCondition: item.storageCondition,
        }));
        await tx.insert(goodsReceiptItems).values(itemsToInsert);
      }

      return {
        ...newGrn,
        items: createDto.items,
      };
    });
  }

  async findAll() {
    return await this.db.select().from(goodsReceiptNotes);
  }

  async findOne(id: string) {
    const grnResult = await this.db.select().from(goodsReceiptNotes).where(eq(goodsReceiptNotes.id, id));
    if (grnResult.length === 0) throw new NotFoundException(`GRN ${id} not found`);

    const itemsResult = await this.db.select().from(goodsReceiptItems).where(eq(goodsReceiptItems.grnId, id));

    return {
      ...grnResult[0],
      items: itemsResult,
    };
  }

  async update(id: string, updateDto: UpdateGoodsReceiptNoteDto) {
    const [updated] = await this.db.update(goodsReceiptNotes)
      .set({ ...updateDto, updatedAt: new Date() } as any)
      .where(eq(goodsReceiptNotes.id, id))
      .returning();
    return updated;
  }

  async remove(id: string) {
    const grn = await this.findOne(id);

    await this.db.insert(trash).values({
      originalTable: 'goods_receipt_notes',
      originalId: id,
      data: grn,
    });

    await this.db.delete(goodsReceiptItems).where(eq(goodsReceiptItems.grnId, id));
    await this.db.delete(goodsReceiptNotes).where(eq(goodsReceiptNotes.id, id));

    return { message: 'GRN moved to trash', id };
  }
}
