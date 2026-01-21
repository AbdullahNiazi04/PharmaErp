import { Controller, Get, Post, Body, Param, Delete, Query } from '@nestjs/common';
import { ProcurementOptionsService } from './procurement-options.service';
import { CreateOptionDto } from './dto/create-option.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Procurement Options')
@Controller('procurement-options')
export class ProcurementOptionsController {
  constructor(private readonly procurementOptionsService: ProcurementOptionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new option' })
  create(@Body() createOptionDto: CreateOptionDto) {
    return this.procurementOptionsService.create(createOptionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all options, optionally filtered by type' })
  findAll(@Query('type') type?: string) {
    return this.procurementOptionsService.findAll(type);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an option' })
  remove(@Param('id') id: string) {
    return this.procurementOptionsService.remove(id);
  }
}
