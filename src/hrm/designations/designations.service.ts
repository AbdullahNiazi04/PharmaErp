import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { DRIZZLE } from '../../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { designations, trash } from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DesignationsService {
    constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

    async create(createDto: CreateDesignationDto) {
        const [desg] = await this.db.insert(designations).values({
            title: createDto.title,
            level: createDto.level,
        }).returning();
        return desg;
    }

    async findAll() {
        return await this.db.select().from(designations);
    }

    async findOne(id: string) {
        const result = await this.db.select().from(designations).where(eq(designations.id, id));
        if (result.length === 0) throw new NotFoundException(`Designation ${id} not found`);
        return result[0];
    }

    async update(id: string, updateDto: UpdateDesignationDto) {
        const [updated] = await this.db.update(designations)
            .set({ ...updateDto, updatedAt: new Date() } as any)
            .where(eq(designations.id, id))
            .returning();
        if (!updated) throw new NotFoundException(`Designation ${id} not found`);
        return updated;
    }

    async remove(id: string) {
        const desg = await this.findOne(id);
        await this.db.insert(trash).values({
            originalTable: 'designations',
            originalId: id,
            data: desg,
        });
        await this.db.delete(designations).where(eq(designations.id, id));
        return { message: 'Designation moved to trash', id };
    }
}
