import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { DRIZZLE } from '../../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { attendance, trash } from '../../database/schema';
import { eq, and } from 'drizzle-orm';

@Injectable()
export class AttendanceService {
    constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

    async create(createDto: CreateAttendanceDto) {
        const [att] = await this.db.insert(attendance).values({
            employeeId: createDto.employeeId,
            date: createDto.date,
            checkIn: createDto.checkIn ? new Date(createDto.checkIn) : null,
            checkOut: createDto.checkOut ? new Date(createDto.checkOut) : null,
            status: createDto.status || 'Present',
            overtimeHours: createDto.overtimeHours ? createDto.overtimeHours.toString() : '0',
            remarks: createDto.remarks,
        }).returning();
        return att;
    }

    async findAll() {
        return await this.db.select().from(attendance);
    }

    async findByEmployee(employeeId: string) {
        return await this.db.select().from(attendance).where(eq(attendance.employeeId, employeeId));
    }

    async findOne(id: string) {
        const result = await this.db.select().from(attendance).where(eq(attendance.id, id));
        if (result.length === 0) throw new NotFoundException(`Attendance ${id} not found`);
        return result[0];
    }

    async update(id: string, updateDto: UpdateAttendanceDto) {
        const updateData: any = { ...updateDto };
        if (updateDto.checkIn) updateData.checkIn = new Date(updateDto.checkIn);
        if (updateDto.checkOut) updateData.checkOut = new Date(updateDto.checkOut);
        if (updateDto.overtimeHours) updateData.overtimeHours = updateDto.overtimeHours.toString();

        const [updated] = await this.db.update(attendance)
            .set(updateData)
            .where(eq(attendance.id, id))
            .returning();
        if (!updated) throw new NotFoundException(`Attendance ${id} not found`);
        return updated;
    }

    async remove(id: string) {
        const att = await this.findOne(id);
        await this.db.insert(trash).values({
            originalTable: 'attendance',
            originalId: id,
            data: att,
        });
        await this.db.delete(attendance).where(eq(attendance.id, id));
        return { message: 'Attendance moved to trash', id };
    }
}
