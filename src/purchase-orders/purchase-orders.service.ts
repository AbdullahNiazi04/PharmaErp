import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { purchaseOrders, purchaseOrderItems, trash, purchaseRequisitionItems } from '../database/schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class PurchaseOrdersService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  async create(createDto: CreatePurchaseOrderDto) {
    return await this.db.transaction(async (tx) => {
      let itemsToUse = createDto.items;
      let poNumber = createDto.poNumber;

      if (!poNumber) {
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        // Fetch the last created PO to determine the next sequence number
        const lastPo = await tx.select({ poNumber: purchaseOrders.poNumber })
            .from(purchaseOrders)
            .orderBy(sql`${purchaseOrders.createdAt} DESC`)
            .limit(1);

        let nextCount = 1;
        if (lastPo.length > 0 && lastPo[0].poNumber) {
            const parts = lastPo[0].poNumber.split('-');
            if (parts.length === 3) {
                const lastCount = parseInt(parts[2], 10);
                if (!isNaN(lastCount)) {
                    nextCount = lastCount + 1;
                }
            }
        }
        poNumber = `PO-${dateStr}-${nextCount.toString().padStart(4, '0')}`;
      }

      // Auto-fill from PR if items are empty and PR ID is provided
      if ((!itemsToUse || itemsToUse.length === 0) && createDto.referencePrId) {
        const prItems = await tx.select().from(purchaseRequisitionItems).where(eq(purchaseRequisitionItems.prId, createDto.referencePrId));
        if (prItems.length > 0) {
            itemsToUse = prItems.map(prItem => ({
                itemCode: prItem.itemCode || undefined,
                description: prItem.itemName || '', // Map itemName to description
                quantity: prItem.quantity,
                unitPrice: Number(prItem.estimatedUnitCost) || 0,
                // Default others
                discountPercent: 0,
                taxPercent: 0,
                isBatchRequired: false,
            }));
        }
      }

      let subtotal = 0;
      let totalTaxAmount = 0; // If calculating tax per item

      const itemsToInsert = itemsToUse.map(item => {
        const qty = item.quantity || 0;
        const price = item.unitPrice || 0;
        const discountPct = item.discountPercent || 0;
        const taxPct = item.taxPercent || 0;

        let netAmount = 0;
        let taxAmount = 0;
        let totalAmount = 0;

        // Logic for Tax Inclusive/Exclusive
        const isTaxInclusive = createDto.taxCategory === 'Inclusive';

        if (isTaxInclusive) {
            // Price is gross (includes tax)
            // We assume discount is applied on the inclusive price first? Or on base? 
            // Standard: Discount on Gross, then separate Tax.
            // Let's assume Unit Price is the Final Price per unit including tax.
            
            const grossTotal = qty * price;
            const discountedTotal = grossTotal * (1 - discountPct / 100);
            
            totalAmount = discountedTotal;
            // Back-calculate Net and Tax
            // Total = Net * (1 + TaxRate)
            // Net = Total / (1 + TaxRate)
            netAmount = totalAmount / (1 + taxPct / 100);
            taxAmount = totalAmount - netAmount;

        } else {
            // Exclusive (Standard)
            const grossAmount = qty * price;
            const discountAmount = grossAmount * (discountPct / 100);
            netAmount = grossAmount - discountAmount;

            taxAmount = netAmount * (taxPct / 100);
            totalAmount = netAmount + taxAmount;
        }

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
          netAmount: netAmount.toFixed(2), // Rounding for DB consistency
          totalAmount: totalAmount.toFixed(2),
          isBatchRequired: item.isBatchRequired ?? false,
        };
      });

      const freight = createDto.freightCharges || 0;
      const insurance = createDto.insuranceCharges || 0;
      const finalTotal = subtotal + totalTaxAmount + freight + insurance;

      // 1. Insert Header
      const [newPo] = await tx.insert(purchaseOrders).values({
        poNumber: poNumber,
        poDate: createDto.poDate,
        vendorId: createDto.vendorId,
        referencePrId: createDto.referencePrId,
        currency: createDto.currency,
        paymentTerms: createDto.paymentTerms,
        termsAndConditions: createDto.termsAndConditions,
        incoterms: createDto.incoterms,
        deliverySchedule: createDto.deliverySchedule ? createDto.deliverySchedule : null,
        deliveryLocation: createDto.deliveryLocation,

        taxCategory: createDto.taxCategory || 'Exclusive',
        freightCharges: freight.toString(),
        insuranceCharges: insurance.toString(),
        subtotal: subtotal.toFixed(2),
        taxAmount: totalTaxAmount.toFixed(2),
        totalAmount: finalTotal.toFixed(2),
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

  async getVendorHistory(vendorId: string) {
    // Get last 5 POs for this vendor to show history of cost/delivery
    const history = await this.db.select()
        .from(purchaseOrders)
        .where(eq(purchaseOrders.vendorId, vendorId))
        .orderBy(sql`${purchaseOrders.createdAt} DESC`)
        .limit(5);
        
    return history;
  }
}
