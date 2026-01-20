import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateGoodsReceiptNoteDto } from './dto/create-goods-receipt-note.dto';
import { UpdateGoodsReceiptNoteDto } from './dto/update-goods-receipt-note.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { goodsReceiptNotes, goodsReceiptItems, trash, purchaseOrderItems } from '../database/schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class GoodsReceiptNotesService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  async create(createDto: CreateGoodsReceiptNoteDto) {
    return await this.db.transaction(async (tx) => {
      let itemsToUse = createDto.items;
      let grnNumber = createDto.grnNumber;

      if (!grnNumber) {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        // Fetch the last created GRN
        const lastGrn = await tx.select({ grnNumber: goodsReceiptNotes.grnNumber })
            .from(goodsReceiptNotes)
            .orderBy(sql`${goodsReceiptNotes.createdAt} DESC`)
            .limit(1);

        let nextCount = 1;
        if (lastGrn.length > 0 && lastGrn[0].grnNumber) {
            const parts = lastGrn[0].grnNumber.split('-');
            if (parts.length === 3) {
                const lastCount = parseInt(parts[2], 10);
                if (!isNaN(lastCount)) {
                    nextCount = lastCount + 1;
                }
            }
        }
        grnNumber = `GRN-${dateStr}-${nextCount.toString().padStart(4, '0')}`;
      }

      // Auto-fill from PO if items are empty and PO ID is provided
      if ((!itemsToUse || itemsToUse.length === 0) && createDto.poId) {
        const poItems = await tx.select().from(purchaseOrderItems).where(eq(purchaseOrderItems.poId, createDto.poId));
        if (poItems.length > 0) {
            itemsToUse = poItems.map(poItem => ({
                itemCode: poItem.itemCode || undefined,
                itemName: poItem.description || undefined, // Map description to itemName
                orderedQty: poItem.quantity,
                receivedQty: poItem.quantity, // Default to receiving full amount
                rejectedQty: 0,
                // Batch/expiry info is usually entered manually at GRN, so leave blank or default
            }));
        }
      }

      // 1. Insert Header
      const [newGrn] = await tx.insert(goodsReceiptNotes).values({
        grnNumber: grnNumber,
        grnDate: createDto.grnDate,
        poId: createDto.poId,
        warehouseLocation: createDto.warehouseLocation,
        receivedBy: createDto.receivedBy,
        
        qcRequired: createDto.qcRequired ?? false,
        qcStatus: createDto.qcRequired ? 'Pending' : 'Skipped',
        urgencyStatus: createDto.urgencyStatus || 'Normal',
        qcRemarks: createDto.qcRemarks,
        qcIntimationDate: createDto.qcIntimationDate ? new Date(createDto.qcIntimationDate) : (createDto.qcRequired ? new Date() : null),

        attachments: createDto.attachments || [],
        importDocuments: createDto.importDocuments || [],

        stockPosted: createDto.stockPosted ?? false,
        inventoryLocation: createDto.inventoryLocation,
        status: 'Draft',
      }).returning();

      // 2. Insert Items
      if (itemsToUse && itemsToUse.length > 0) {
        const itemsToInsert = itemsToUse.map(item => ({
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

      // TODO: If status is 'Submitted' or 'Approved', trigger Post-GRN actions (Stock, Invoice)
      
      return {
        ...newGrn,
        items: itemsToUse,
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
