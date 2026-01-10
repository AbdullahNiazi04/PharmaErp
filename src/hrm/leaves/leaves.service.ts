import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { DRIZZLE } from '../../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { leaveRequests, trash } from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class LeavesService {
    constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

    private calculateDays(startDate: string, endDate: string): number {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return diff;
    }

    async create(createDto: CreateLeaveDto) {
        const totalDays = this.calculateDays(createDto.startDate, createDto.endDate);

        const [leave] = await this.db.insert(leaveRequests).values({
            employeeId: createDto.employeeId,
            leaveType: createDto.leaveType,
            startDate: createDto.startDate,
            endDate: createDto.endDate,
            totalDays: totalDays,
            reason: createDto.reason,
            status: 'Pending',
        }).returning();
        return leave;
    }

    async findAll() {
        return await this.db.select().from(leaveRequests);
    }

    async findByEmployee(employeeId: string) {
        return await this.db.select().from(leaveRequests).where(eq(leaveRequests.employeeId, employeeId));
    }

    async findOne(id: string) {
        const result = await this.db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
        if (result.length === 0) throw new NotFoundException(`Leave request ${id} not found`);
        return result[0];
    }

    async update(id: string, updateDto: UpdateLeaveDto) {
        const [updated] = await this.db.update(leaveRequests)
            .set({ ...updateDto, updatedAt: new Date() } as any)
            .where(eq(leaveRequests.id, id))
            .returning();
        if (!updated) throw new NotFoundException(`Leave request ${id} not found`);
        return updated;
    }

    async remove(id: string) {
        const leave = await this.findOne(id);
        await this.db.insert(trash).values({
            originalTable: 'leave_requests',
            originalId: id,
            data: leave,
        });
        await this.db.delete(leaveRequests).where(eq(leaveRequests.id, id));
        return { message: 'Leave request moved to trash', id };
    }
}
