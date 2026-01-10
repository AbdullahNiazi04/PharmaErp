import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@ApiTags('HRM - Departments')
@Controller('hrm/departments')
export class DepartmentsController {
    constructor(private readonly departmentsService: DepartmentsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new department' })
    create(@Body() createDto: CreateDepartmentDto) {
        return this.departmentsService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all departments' })
    findAll() {
        return this.departmentsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get department by ID' })
    findOne(@Param('id') id: string) {
        return this.departmentsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update department' })
    update(@Param('id') id: string, @Body() updateDto: UpdateDepartmentDto) {
        return this.departmentsService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete department' })
    remove(@Param('id') id: string) {
        return this.departmentsService.remove(id);
    }
}
