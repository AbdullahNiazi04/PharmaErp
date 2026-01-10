import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { payments, invoices, trash } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class PaymentsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  async create(createDto: CreatePaymentDto) {
    // Ideally we should check if invoice exists and verify amounts, but for now simple insert
    const [newPayment] = await this.db.insert(payments).values({
      invoiceId: createDto.invoiceId,
      paymentDate: createDto.paymentDate,
      paymentMethod: createDto.paymentMethod || 'Bank Transfer',
      amountPaid: createDto.amountPaid.toString(),
      taxWithheld: (createDto.taxWithheld || 0).toString(),
      advanceAdjustments: (createDto.advanceAdjustments || 0).toString(),
      paymentReference: createDto.paymentReference,
      status: createDto.status || 'Pending',
    }).returning();

    // Optionally update invoice status if fully paid? 
    // const inv = await this.db.select().from(invoices).where(eq(invoices.id, createDto.invoiceId));
    // ... logic to check total payments vs invoice amount ...

    return newPayment;
  }

  async findAll() {
    return await this.db.select().from(payments);
  }

  async findOne(id: string) {
    const result = await this.db.select().from(payments).where(eq(payments.id, id));
    if (result.length === 0) throw new NotFoundException(`Payment ${id} not found`);
    return result[0];
  }

  async update(id: string, updateDto: UpdatePaymentDto) {
    const [updated] = await this.db.update(payments)
      .set({ ...updateDto, updatedAt: new Date() } as any)
      .where(eq(payments.id, id))
      .returning();
    return updated;
  }

  async remove(id: string) {
    const payment = await this.findOne(id);
    await this.db.insert(trash).values({
      originalTable: 'payments',
      originalId: id,
      data: payment,
    });
    await this.db.delete(payments).where(eq(payments.id, id));
    return { message: 'Payment moved to trash', id };
  }
}
