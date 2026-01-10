import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';

@ApiTags('HRM - Leaves')
@Controller('hrm/leaves')
export class LeavesController {
    constructor(private readonly leavesService: LeavesService) { }

    @Post()
    @ApiOperation({ summary: 'Apply for leave' })
    create(@Body() createDto: CreateLeaveDto) {
        return this.leavesService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all leave requests' })
    findAll() {
        return this.leavesService.findAll();
    }

    @Get('employee/:employeeId')
    @ApiOperation({ summary: 'Get leaves by employee' })
    findByEmployee(@Param('employeeId') employeeId: string) {
        return this.leavesService.findByEmployee(employeeId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get leave by ID' })
    findOne(@Param('id') id: string) {
        return this.leavesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Approve/Reject leave' })
    update(@Param('id') id: string, @Body() updateDto: UpdateLeaveDto) {
        return this.leavesService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete leave request' })
    remove(@Param('id') id: string) {
        return this.leavesService.remove(id);
    }
}
