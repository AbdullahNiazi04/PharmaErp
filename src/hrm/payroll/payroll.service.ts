import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreatePayrollDto, ProcessPayrollDto } from './dto/payroll.dto';
import { DRIZZLE } from '../../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { payrollPeriods, paySlips, employees, attendance, leaveRequests, trash } from '../../database/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

@Injectable()
export class PayrollService {
    constructor(@Inject(DRIZZLE) private db: NodePgDatabase) { }

    async createPeriod(createDto: CreatePayrollDto) {
        const [period] = await this.db.insert(payrollPeriods).values({
            month: createDto.month,
            year: createDto.year,
            status: 'Open',
        }).returning();
        return period;
    }

    async findAllPeriods() {
        return await this.db.select().from(payrollPeriods);
    }

    async findOnePeriod(id: string) {
        const result = await this.db.select().from(payrollPeriods).where(eq(payrollPeriods.id, id));
        if (result.length === 0) throw new NotFoundException(`Payroll period ${id} not found`);
        return result[0];
    }

    async processPayroll(periodId: string, processDto: ProcessPayrollDto) {
        const period = await this.findOnePeriod(periodId);
        const taxPercent = processDto.taxPercent || 5;
        const overtimeRate = processDto.overtimeRate || 500;

        // Get all active employees
        const allEmployees = await this.db.select().from(employees).where(eq(employees.status, 'Active'));

        // Calculate payslips for each employee
        let totalDisbursement = 0;
        const slips: any[] = [];

        for (const emp of allEmployees) {
            const basicSalary = parseFloat(emp.basicSalary as string) || 0;

            // Get attendance for this month (simplified - count absents)
            // In real app, would query by date range
            const empAttendance = await this.db.select().from(attendance)
                .where(eq(attendance.employeeId, emp.id));

            const absentDays = empAttendance.filter(a => a.status === 'Absent').length;
            const totalOvertimeHours = empAttendance.reduce((sum, a) =>
                sum + (parseFloat(a.overtimeHours as string) || 0), 0);

            // Calculate amounts
            const dailyRate = basicSalary / 30;
            const unpaidLeaveDed = absentDays * dailyRate;
            const overtimePay = totalOvertimeHours * overtimeRate;
            const allowances = basicSalary * 0.1; // 10% allowance

            const grossSalary = basicSalary + allowances + overtimePay;
            const taxDeduction = grossSalary * (taxPercent / 100);
            const netSalary = grossSalary - taxDeduction - unpaidLeaveDed;

            // Insert payslip
            const [slip] = await this.db.insert(paySlips).values({
                payrollId: periodId,
                employeeId: emp.id,
                basicSalaryPaid: basicSalary.toString(),
                allowances: allowances.toString(),
                overtimePay: overtimePay.toString(),
                taxDeduction: taxDeduction.toString(),
                unpaidLeaveDed: unpaidLeaveDed.toString(),
                otherDeductions: '0',
                netSalary: netSalary.toString(),
            }).returning();

            slips.push(slip);
            totalDisbursement += netSalary;
        }

        // Update period
        await this.db.update(payrollPeriods)
            .set({
                totalDisbursement: totalDisbursement.toString(),
                status: 'Processed',
                updatedAt: new Date()
            })
            .where(eq(payrollPeriods.id, periodId));

        return {
            periodId,
            employeesProcessed: allEmployees.length,
            totalDisbursement,
            slips,
        };
    }

    async getPaySlip(id: string) {
        const result = await this.db.select().from(paySlips).where(eq(paySlips.id, id));
        if (result.length === 0) throw new NotFoundException(`Pay slip ${id} not found`);
        return result[0];
    }

    async getPaySlipsByPeriod(periodId: string) {
        return await this.db.select().from(paySlips).where(eq(paySlips.payrollId, periodId));
    }

    async getPaySlipsByEmployee(employeeId: string) {
        return await this.db.select().from(paySlips).where(eq(paySlips.employeeId, employeeId));
    }

    async markAsPaid(periodId: string) {
        const [updated] = await this.db.update(payrollPeriods)
            .set({ status: 'Paid', updatedAt: new Date() })
            .where(eq(payrollPeriods.id, periodId))
            .returning();
        return updated;
    }
}
