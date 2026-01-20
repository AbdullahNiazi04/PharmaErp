import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreatePurchaseRequisitionDto } from './dto/create-purchase-requisition.dto';
import { UpdatePurchaseRequisitionDto } from './dto/update-purchase-requisition.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { purchaseRequisitions, purchaseRequisitionItems, trash, purchaseOrders } from '../database/schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class PurchaseRequisitionsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  async create(createDto: CreatePurchaseRequisitionDto) {
    return await this.db.transaction(async (tx) => {
      // 1. Calculate Total Cost
      let prTotalCost = 0;
      createDto.items.forEach(item => {
        if (item.estimatedUnitCost && item.quantity) {
          prTotalCost += (item.estimatedUnitCost * item.quantity);
        }
      });

      // 2. Insert Header
      const [newPr] = await tx.insert(purchaseRequisitions).values({
        reqNumber: createDto.reqNumber,
        requisitionDate: createDto.requisitionDate,
        requestedBy: createDto.requestedBy,
        department: createDto.department,
        costCenter: createDto.costCenter,
        priority: createDto.priority,
        expectedDeliveryDate: createDto.expectedDeliveryDate ? createDto.expectedDeliveryDate : null,
        budgetReference: createDto.budgetReference,
        status: 'Draft',
        totalEstimatedCost: prTotalCost.toString(),
      }).returning();

      // 3. Insert Items
      if (createDto.items && createDto.items.length > 0) {
        const itemsToInsert = createDto.items.map(item => ({
          prId: newPr.id,
          itemCode: item.itemCode,
          itemName: item.itemName,
          category: item.category,
          uom: item.uom,
          quantity: item.quantity,
          estimatedUnitCost: item.estimatedUnitCost ? item.estimatedUnitCost.toString() : null,
          totalCost: (item.estimatedUnitCost && item.quantity) ? (item.estimatedUnitCost * item.quantity).toString() : null,
          preferredVendorId: item.preferredVendorId,
          specification: item.specification,
        }));
        await tx.insert(purchaseRequisitionItems).values(itemsToInsert);
      }

      // Return complete object
      return {
        ...newPr,
        items: createDto.items,
      };
    });
  }

  async findAll() {
    // Basic fetch - in real app, might want to join items or return header stats only
    return await this.db.select().from(purchaseRequisitions);
  }

  async findOne(id: string) {
    const prResult = await this.db.select().from(purchaseRequisitions).where(eq(purchaseRequisitions.id, id));
    if (prResult.length === 0) throw new NotFoundException(`PR ${id} not found`);

    const itemsResult = await this.db.select().from(purchaseRequisitionItems).where(eq(purchaseRequisitionItems.prId, id));

    return {
      ...prResult[0],
      items: itemsResult,
    };
  }

  async update(id: string, updateDto: UpdatePurchaseRequisitionDto) {
    const existingPr = await this.findOne(id);
    
    if (existingPr.status === 'Converted') {
        throw new Error('Cannot edit a converted PR. It has already been processed.');
    }

    // Logic: If PR was Approved, any edit should reset it to Pending Approval (or Draft) to re-trigger checks.
    // unless the update is just changing status itself.
    const newStatus = (existingPr.status === 'Approved' && !updateDto.status) 
        ? 'Pending Approval' 
        : updateDto.status || existingPr.status;

    const [updated] = await this.db.update(purchaseRequisitions)
      .set({ 
          ...updateDto, 
          status: newStatus,
          updatedAt: new Date() 
      } as any)
      .where(eq(purchaseRequisitions.id, id))
      .returning();
    return updated;
  }

  async remove(id: string) {
    // 1. Check if PR is linked to any PO
    const linkedPOs = await this.db.select({ poNumber: purchaseOrders.poNumber })
        .from(purchaseOrders)
        .where(eq(purchaseOrders.referencePrId, id));

    if (linkedPOs.length > 0) {
        throw new BadRequestException(
            `Cannot delete PR because it is linked to Purchase Order(s): ${linkedPOs.map(p => p.poNumber).join(', ')}`
        );
    }

    const pr = await this.findOne(id);

    // 2. Archive to trash
    await this.db.insert(trash).values({
      originalTable: 'purchase_requisitions',
      originalId: id,
      data: pr,
    });

    // 3. Delete Items first (FK dependency)
    await this.db.delete(purchaseRequisitionItems).where(eq(purchaseRequisitionItems.prId, id));
    
    // 4. Delete Header
    await this.db.delete(purchaseRequisitions).where(eq(purchaseRequisitions.id, id));

    return { message: 'PR moved to trash', id };
  }
}
