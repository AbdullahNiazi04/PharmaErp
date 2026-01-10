import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { DRIZZLE } from '../../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { employees, trash } from '../../database/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class EmployeesService {
    constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

    async create(createDto: CreateEmployeeDto) {
        const [emp] = await this.db.insert(employees).values({
            employeeCode: createDto.employeeCode,
            fullName: createDto.fullName,
            cnicPassport: createDto.cnicPassport,
            dateOfBirth: createDto.dateOfBirth,
            gender: createDto.gender,
            departmentId: createDto.departmentId,
            designationId: createDto.designationId,
            joiningDate: createDto.joiningDate,
            employmentType: createDto.employmentType,
            basicSalary: createDto.basicSalary.toString(),
            bankAccount: createDto.bankAccount,
            socialSecurityNo: createDto.socialSecurityNo,
        }).returning();
        return emp;
    }

    async findAll() {
        return await this.db.select().from(employees);
    }

    async findOne(id: string) {
        const result = await this.db.select().from(employees).where(eq(employees.id, id));
        if (result.length === 0) throw new NotFoundException(`Employee ${id} not found`);
        return result[0];
    }

    async update(id: string, updateDto: UpdateEmployeeDto) {
        const updateData: any = { ...updateDto, updatedAt: new Date() };
        if (updateDto.basicSalary) {
            updateData.basicSalary = updateDto.basicSalary.toString();
        }
        const [updated] = await this.db.update(employees)
            .set(updateData)
            .where(eq(employees.id, id))
            .returning();
        if (!updated) throw new NotFoundException(`Employee ${id} not found`);
        return updated;
    }

    async remove(id: string) {
        const emp = await this.findOne(id);
        await this.db.insert(trash).values({
            originalTable: 'employees',
            originalId: id,
            data: emp,
        });
        await this.db.delete(employees).where(eq(employees.id, id));
        return { message: 'Employee moved to trash', id };
    }
}
