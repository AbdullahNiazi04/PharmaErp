import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { customers, trash } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class CustomersService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  async create(createDto: CreateCustomerDto) {
    const [customer] = await this.db.insert(customers).values(createDto).returning();
    return customer;
  }

  async findAll() {
    return await this.db.select().from(customers);
  }

  async findOne(id: string) {
    const result = await this.db.select().from(customers).where(eq(customers.id, id));
    if (result.length === 0) throw new NotFoundException(`Customer ${id} not found`);
    return result[0];
  }

  async update(id: string, updateDto: Partial<CreateCustomerDto>) {
    await this.findOne(id);
    const [updated] = await this.db.update(customers)
      .set({
        ...updateDto,
        updatedAt: new Date(),
      })
      .where(eq(customers.id, id))
      .returning();
    return updated;
  }

  async remove(id: string) {
    const customer = await this.findOne(id);
    await this.db.insert(trash).values({
      originalTable: 'customers',
      originalId: id,
      data: customer,
    });
    await this.db.delete(customers).where(eq(customers.id, id));
    return { message: 'Customer moved to trash', id };
  }
}

