import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { warehouses, trash } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class WarehousesService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  async create(createDto: CreateWarehouseDto) {
    const [newItem] = await this.db.insert(warehouses).values({
      name: createDto.name,
      type: createDto.type,
      location: createDto.location,
      temperatureRange: createDto.temperatureRange,
      humidityRange: createDto.humidityRange
    }).returning();
    return newItem;
  }

  async findAll() {
    return await this.db.select().from(warehouses);
  }

  async findOne(id: string) {
    const result = await this.db.select().from(warehouses).where(eq(warehouses.id, id));
    if (result.length === 0) throw new NotFoundException(`Warehouse ${id} not found`);
    return result[0];
  }

  // async update...

  async remove(id: string) {
    const wh = await this.findOne(id);
    await this.db.insert(trash).values({
      originalTable: 'warehouses',
      originalId: id,
      data: wh,
    });
    await this.db.delete(warehouses).where(eq(warehouses.id, id));
    return { message: 'Warehouse moved to trash', id };
  }
}
