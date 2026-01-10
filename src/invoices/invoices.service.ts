import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { invoices, trash } from '../database/schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class InvoicesService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  async create(createDto: CreateInvoiceDto) {
    const [newInvoice] = await this.db.insert(invoices).values({
      invoiceNumber: createDto.invoiceNumber,
      invoiceDate: createDto.invoiceDate,
      vendorId: createDto.vendorId,
      poId: createDto.poId,
      grnId: createDto.grnId,
      amount: createDto.amount.toString(),
      dueDate: createDto.dueDate,
      status: createDto.status || 'Pending',
    }).returning();
    return newInvoice;
  }

  async findAll() {
    return await this.db.select().from(invoices);
  }

  async getStats() {
    const totalResult = await this.db.execute(sql`SELECT COUNT(*) as count, SUM(amount) as total FROM invoices`);
    const pendingResult = await this.db.execute(sql`SELECT COUNT(*) as count, SUM(amount) as total FROM invoices WHERE status = 'Pending'`);

    return {
      totalInvoices: totalResult.rows[0],
      pendingInvoices: pendingResult.rows[0]
    };
  }

  async findOne(id: string) {
    const result = await this.db.select().from(invoices).where(eq(invoices.id, id));
    if (result.length === 0) throw new NotFoundException(`Invoice ${id} not found`);
    return result[0];
  }

  async update(id: string, updateDto: UpdateInvoiceDto) {
    const [updated] = await this.db.update(invoices)
      .set({ ...updateDto, updatedAt: new Date() } as any)
      .where(eq(invoices.id, id))
      .returning();
    return updated;
  }

  async remove(id: string) {
    const invoice = await this.findOne(id);
    await this.db.insert(trash).values({
      originalTable: 'invoices',
      originalId: id,
      data: invoice,
    });
    await this.db.delete(invoices).where(eq(invoices.id, id));
    return { message: 'Invoice moved to trash', id };
  }
}
