import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@ApiTags('HRM - Attendance')
@Controller('hrm/attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post()
    @ApiOperation({ summary: 'Mark attendance' })
    create(@Body() createDto: CreateAttendanceDto) {
        return this.attendanceService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all attendance records' })
    findAll() {
        return this.attendanceService.findAll();
    }

    @Get('employee/:employeeId')
    @ApiOperation({ summary: 'Get attendance by employee' })
    findByEmployee(@Param('employeeId') employeeId: string) {
        return this.attendanceService.findByEmployee(employeeId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get attendance by ID' })
    findOne(@Param('id') id: string) {
        return this.attendanceService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update attendance' })
    update(@Param('id') id: string, @Body() updateDto: UpdateAttendanceDto) {
        return this.attendanceService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete attendance' })
    remove(@Param('id') id: string) {
        return this.attendanceService.remove(id);
    }
}
