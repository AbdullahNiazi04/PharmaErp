import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { vendors, trash } from '../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class VendorsService {
  constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

  async create(createVendorDto: CreateVendorDto) {
    const [newItem] = await this.db.insert(vendors).values({
      ...createVendorDto,
      licenseExpiryDate: createVendorDto.licenseExpiryDate ? createVendorDto.licenseExpiryDate : null,
      creditLimit: createVendorDto.creditLimit ? createVendorDto.creditLimit.toString() : null,
      taxWithholdingPercent: createVendorDto.taxWithholdingPercent ? createVendorDto.taxWithholdingPercent.toString() : null,
    } as any).returning();
    return newItem;
  }

  async findAll() {
    return await this.db.select().from(vendors);
  }

  async findOne(id: string) {
    const result = await this.db.select().from(vendors).where(eq(vendors.id, id));
    if (result.length === 0) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return result[0];
  }

  async update(id: string, updateVendorDto: UpdateVendorDto) {
    const [updated] = await this.db.update(vendors)
      .set({
        ...updateVendorDto,
        licenseExpiryDate: updateVendorDto.licenseExpiryDate ? updateVendorDto.licenseExpiryDate : undefined,
        creditLimit: updateVendorDto.creditLimit ? updateVendorDto.creditLimit.toString() : undefined,
        taxWithholdingPercent: updateVendorDto.taxWithholdingPercent ? updateVendorDto.taxWithholdingPercent.toString() : undefined,
        updatedAt: new Date(),
      } as any)
      .where(eq(vendors.id, id))
      .returning();

    if (!updated) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    return updated;
  }

  async remove(id: string) {
    // 1. Get the item first
    const item = await this.findOne(id);

    // 2. Move to Trash
    await this.db.insert(trash).values({
      originalTable: 'vendors',
      originalId: id,
      data: item,
    });

    // 3. Delete from original table
    await this.db.delete(vendors).where(eq(vendors.id, id));

    return { message: 'Vendor moved to trash successfully', deletedId: id };
  }
}
