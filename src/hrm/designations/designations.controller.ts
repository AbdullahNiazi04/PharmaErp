import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DesignationsService } from './designations.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';

@ApiTags('HRM - Designations')
@Controller('hrm/designations')
export class DesignationsController {
    constructor(private readonly designationsService: DesignationsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new designation' })
    create(@Body() createDto: CreateDesignationDto) {
        return this.designationsService.create(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all designations' })
    findAll() {
        return this.designationsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get designation by ID' })
    findOne(@Param('id') id: string) {
        return this.designationsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update designation' })
    update(@Param('id') id: string, @Body() updateDto: UpdateDesignationDto) {
        return this.designationsService.update(id, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete designation' })
    remove(@Param('id') id: string) {
        return this.designationsService.remove(id);
    }
}
