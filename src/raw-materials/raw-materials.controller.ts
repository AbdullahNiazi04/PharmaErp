import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { RawMaterialsService } from './raw-materials.service';
import { CreateRawMaterialDto, CreateRawMaterialInventoryDto } from './dto/create-raw-material.dto';
import { CreateRawMaterialBatchDto } from './dto/create-batch.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('raw-materials')
@Controller('raw-materials')
export class RawMaterialsController {
  constructor(private readonly rawMaterialsService: RawMaterialsService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createDto: CreateRawMaterialDto) {
    return this.rawMaterialsService.create(createDto);
  }

  @Post('inventory')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createInventory(@Body() createDto: CreateRawMaterialInventoryDto) {
    return this.rawMaterialsService.createInventoryConfig(createDto);
  }

  @Post('batches')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  addBatch(@Body() createDto: CreateRawMaterialBatchDto) {
    return this.rawMaterialsService.addBatch(createDto);
  }

  @Get()
  findAll() {
    return this.rawMaterialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rawMaterialsService.findOne(id);
  }

  @Get('inventory/:id/batches')
  getBatches(@Param('id') id: string) {
    return this.rawMaterialsService.getBatches(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rawMaterialsService.remove(id);
  }
}
