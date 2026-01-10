import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { purchaseOrders, purchaseOrderItems, trash } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PurchaseOrdersService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  async create(createDto: CreatePurchaseOrderDto) {
    return await this.db.transaction(async (tx) => {
      let subtotal = 0;
      let totalTaxAmount = 0; // If calculating tax per item

      const itemsToInsert = createDto.items.map(item => {
        const qty = item.quantity || 0;
        const price = item.unitPrice || 0;
        const discountPct = item.discountPercent || 0;
        const taxPct = item.taxPercent || 0;

        const grossAmount = qty * price;
        const discountAmount = grossAmount * (discountPct / 100);
        const netAmount = grossAmount - discountAmount;

        const taxAmount = netAmount * (taxPct / 100);
        const totalAmount = netAmount + taxAmount;

        subtotal += netAmount;
        totalTaxAmount += taxAmount;

        return {
          poId: '', // placeholder, will set after header insert
          itemCode: item.itemCode,
          description: item.description,
          quantity: qty,
          unitPrice: price.toString(),
          discountPercent: discountPct.toString(),
          taxPercent: taxPct.toString(),
          netAmount: netAmount.toString(),
          totalAmount: totalAmount.toString(),
          isBatchRequired: item.isBatchRequired ?? false,
        };
      });

      const freight = createDto.freightCharges || 0;
      const insurance = createDto.insuranceCharges || 0;
      const finalTotal = subtotal + totalTaxAmount + freight + insurance;

      // 1. Insert Header
      const [newPo] = await tx.insert(purchaseOrders).values({
        poNumber: createDto.poNumber,
        poDate: createDto.poDate,
        vendorId: createDto.vendorId,
        referencePrId: createDto.referencePrId,
        currency: createDto.currency,
        paymentTerms: createDto.paymentTerms,
        incoterms: createDto.incoterms,
        deliverySchedule: createDto.deliverySchedule ? createDto.deliverySchedule : null,
        deliveryLocation: createDto.deliveryLocation,

        freightCharges: freight.toString(),
        insuranceCharges: insurance.toString(),
        subtotal: subtotal.toString(),
        taxAmount: totalTaxAmount.toString(),
        totalAmount: finalTotal.toString(),
        status: 'Draft',
      }).returning();

      // 2. Insert Items
      if (itemsToInsert.length > 0) {
        // Fix PO ID
        itemsToInsert.forEach(i => i.poId = newPo.id);
        await tx.insert(purchaseOrderItems).values(itemsToInsert as any);
      }

      return {
        ...newPo,
        items: itemsToInsert
      };
    });
  }

  async findAll() {
    return await this.db.select().from(purchaseOrders);
  }

  async findOne(id: string) {
    const poResult = await this.db.select().from(purchaseOrders).where(eq(purchaseOrders.id, id));
    if (poResult.length === 0) throw new NotFoundException(`PO ${id} not found`);

    const itemsResult = await this.db.select().from(purchaseOrderItems).where(eq(purchaseOrderItems.poId, id));

    return {
      ...poResult[0],
      items: itemsResult,
    };
  }

  async update(id: string, updateDto: UpdatePurchaseOrderDto) {
    // Only updating header logic here for simplicity, real app might re-calc totals
    const [updated] = await this.db.update(purchaseOrders)
      .set({ ...updateDto, updatedAt: new Date() } as any)
      .where(eq(purchaseOrders.id, id))
      .returning();
    return updated;
  }

  async remove(id: string) {
    const po = await this.findOne(id);

    await this.db.insert(trash).values({
      originalTable: 'purchase_orders',
      originalId: id,
      data: po,
    });

    await this.db.delete(purchaseOrderItems).where(eq(purchaseOrderItems.poId, id));
    await this.db.delete(purchaseOrders).where(eq(purchaseOrders.id, id));

    return { message: 'PO moved to trash', id };
  }
}
