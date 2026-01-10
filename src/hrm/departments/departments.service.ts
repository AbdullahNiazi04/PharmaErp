import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DRIZZLE } from '../../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { departments, trash } from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DepartmentsService {
    constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

    async create(createDto: CreateDepartmentDto) {
        const [dept] = await this.db.insert(departments).values({
            name: createDto.name,
            managerId: createDto.managerId,
        }).returning();
        return dept;
    }

    async findAll() {
        return await this.db.select().from(departments);
    }

    async findOne(id: string) {
        const result = await this.db.select().from(departments).where(eq(departments.id, id));
        if (result.length === 0) throw new NotFoundException(`Department ${id} not found`);
        return result[0];
    }

    async update(id: string, updateDto: UpdateDepartmentDto) {
        const [updated] = await this.db.update(departments)
            .set({ ...updateDto, updatedAt: new Date() } as any)
            .where(eq(departments.id, id))
            .returning();
        if (!updated) throw new NotFoundException(`Department ${id} not found`);
        return updated;
    }

    async remove(id: string) {
        const dept = await this.findOne(id);
        await this.db.insert(trash).values({
            originalTable: 'departments',
            originalId: id,
            data: dept,
        });
        await this.db.delete(departments).where(eq(departments.id, id));
        return { message: 'Department moved to trash', id };
    }
}
