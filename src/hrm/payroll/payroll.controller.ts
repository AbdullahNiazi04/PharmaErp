import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto, ProcessPayrollDto } from './dto/payroll.dto';

@ApiTags('HRM - Payroll')
@Controller('hrm/payroll')
export class PayrollController {
    constructor(private readonly payrollService: PayrollService) { }

    @Post('periods')
    @ApiOperation({ summary: 'Create a new payroll period' })
    createPeriod(@Body() createDto: CreatePayrollDto) {
        return this.payrollService.createPeriod(createDto);
    }

    @Get('periods')
    @ApiOperation({ summary: 'Get all payroll periods' })
    findAllPeriods() {
        return this.payrollService.findAllPeriods();
    }

    @Get('periods/:id')
    @ApiOperation({ summary: 'Get payroll period by ID' })
    findOnePeriod(@Param('id') id: string) {
        return this.payrollService.findOnePeriod(id);
    }

    @Post('periods/:id/process')
    @ApiOperation({ summary: 'Process payroll and generate pay slips' })
    processPayroll(@Param('id') id: string, @Body() processDto: ProcessPayrollDto) {
        return this.payrollService.processPayroll(id, processDto);
    }

    @Patch('periods/:id/mark-paid')
    @ApiOperation({ summary: 'Mark payroll period as paid' })
    markAsPaid(@Param('id') id: string) {
        return this.payrollService.markAsPaid(id);
    }

    @Get('periods/:periodId/slips')
    @ApiOperation({ summary: 'Get all pay slips for a period' })
    getPaySlipsByPeriod(@Param('periodId') periodId: string) {
        return this.payrollService.getPaySlipsByPeriod(periodId);
    }

    @Get('slips/:id')
    @ApiOperation({ summary: 'Get pay slip by ID' })
    getPaySlip(@Param('id') id: string) {
        return this.payrollService.getPaySlip(id);
    }

    @Get('slips/employee/:employeeId')
    @ApiOperation({ summary: 'Get all pay slips for an employee' })
    getPaySlipsByEmployee(@Param('employeeId') employeeId: string) {
        return this.payrollService.getPaySlipsByEmployee(employeeId);
    }
}
