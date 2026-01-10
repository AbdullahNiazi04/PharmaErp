import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateSalesOrderDto } from './dto/create-sale.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { salesOrders, salesOrderItems, dispatches, trash } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class SalesService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  async create(createDto: CreateSalesOrderDto) {
    return await this.db.transaction(async (tx) => {
      let totalAmount = 0;

      const itemsWithNet = createDto.items.map(item => {
        const gross = item.quantity * item.unitPrice;
        const disc = item.discount || 0;
        const tax = item.tax || 0;
        const net = gross - disc + tax;
        totalAmount += net;
        return { ...item, netAmount: net };
      });

      const [order] = await tx.insert(salesOrders).values({
        customerId: createDto.customerId,
        orderDate: createDto.orderDate,
        deliveryDate: createDto.deliveryDate,
        status: 'Draft',
        totalAmount: totalAmount.toString(),
      }).returning();

      if (itemsWithNet.length > 0) {
        await tx.insert(salesOrderItems).values(itemsWithNet.map(i => ({
          salesOrderId: order.id,
          itemId: i.itemId,
          quantity: i.quantity,
          unitPrice: i.unitPrice.toString(),
          discount: (i.discount || 0).toString(),
          tax: (i.tax || 0).toString(),
          netAmount: i.netAmount.toString(),
        })));
      }

      return { ...order, items: itemsWithNet };
    });
  }

  async findAll() {
    return await this.db.select().from(salesOrders);
  }

  async findOne(id: string) {
    const result = await this.db.select().from(salesOrders).where(eq(salesOrders.id, id));
    if (result.length === 0) throw new NotFoundException(`Order ${id} not found`);
    return result[0];
  }

  async createDispatch(orderId: string, warehouseId: string, transporter: string) {
    const [dispatch] = await this.db.insert(dispatches).values({
      salesOrderId: orderId,
      warehouseId: warehouseId,
      transporter: transporter,
      deliveryStatus: 'Pending'
    }).returning();

    await this.db.update(salesOrders).set({ status: 'Dispatched' }).where(eq(salesOrders.id, orderId));
    return dispatch;
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.db.insert(trash).values({
      originalTable: 'sales_orders',
      originalId: id,
      data: order,
    });
    // cascade
    await this.db.delete(salesOrderItems).where(eq(salesOrderItems.salesOrderId, id));
    await this.db.delete(salesOrders).where(eq(salesOrders.id, id));
    return { message: 'Order moved to trash', id };
  }
}
