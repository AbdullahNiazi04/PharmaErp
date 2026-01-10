import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@ApiTags('HRM - Employees')
@Controller('hrm/employees')
export class EmployeesController {
    constructor(private readonly employeesService: EmployeesService) { }

    @Post()
    @ApiOperation({ summary: 'Hire a new employee' })
    create(@Body() createDto: CreateEmployeeDto) {
        return this.employeesService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all employees' })
    findAll() {
        return this.employeesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get employee by ID' })
    findOne(@Param('id') id: string) {
        return this.employeesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update employee' })
    update(@Param('id') id: string, @Body() updateDto: UpdateEmployeeDto) {
        return this.employeesService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete employee' })
    remove(@Param('id') id: string) {
        return this.employeesService.remove(id);
    }
}
