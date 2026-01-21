import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { procurementOptions } from '../database/schema';
import { eq } from 'drizzle-orm';
import { CreateOptionDto } from './dto/create-option.dto';

@Injectable()
export class ProcurementOptionsService {
  constructor(
    @Inject(DRIZZLE)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll(type?: string) {
    if (type) {
        return this.db.select().from(procurementOptions).where(eq(procurementOptions.type, type));
    }
    return this.db.select().from(procurementOptions);
  }

  async create(createOptionDto: CreateOptionDto) {
    return this.db.insert(procurementOptions).values(createOptionDto).returning();
  }

  async remove(id: string) {
    return this.db.delete(procurementOptions).where(eq(procurementOptions.id, id)).returning();
  }
}
