import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { RawMaterialsService } from './raw-materials.service';
import { CreateRawMaterialDto, CreateRawMaterialInventoryDto } from './dto/create-raw-material.dto';
import { CreateRawMaterialBatchDto } from './dto/create-batch.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('raw-materials')
@Controller('raw-materials')
export class RawMaterialsController {
  constructor(private readonly rawMaterialsService: RawMaterialsService) { }

  // === Raw Materials Master ===
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createDto: CreateRawMaterialDto) {
    return this.rawMaterialsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.rawMaterialsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rawMaterialsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateRawMaterialDto>) {
    return this.rawMaterialsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rawMaterialsService.remove(id);
  }

  // === Inventory Configs ===
  @Get('inventory/all')
  findAllInventory() {
    return this.rawMaterialsService.findAllInventory();
  }

  @Post('inventory')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createInventory(@Body() createDto: CreateRawMaterialInventoryDto) {
    return this.rawMaterialsService.createInventoryConfig(createDto);
  }

  @Patch('inventory/:id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateInventory(@Param('id') id: string, @Body() updateDto: Partial<CreateRawMaterialInventoryDto>) {
    return this.rawMaterialsService.updateInventory(id, updateDto);
  }

  @Delete('inventory/:id')
  removeInventory(@Param('id') id: string) {
    return this.rawMaterialsService.removeInventory(id);
  }

  // === Batches ===
  @Get('batches/all')
  findAllBatches() {
    return this.rawMaterialsService.findAllBatches();
  }

  @Get('inventory/:id/batches')
  getBatches(@Param('id') id: string) {
    return this.rawMaterialsService.getBatches(id);
  }

  @Post('batches')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  addBatch(@Body() createDto: CreateRawMaterialBatchDto) {
    return this.rawMaterialsService.addBatch(createDto);
  }

  @Patch('batches/:id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateBatch(@Param('id') id: string, @Body() updateDto: Partial<CreateRawMaterialBatchDto>) {
    return this.rawMaterialsService.updateBatch(id, updateDto);
  }

  @Delete('batches/:id')
  removeBatch(@Param('id') id: string) {
    return this.rawMaterialsService.removeBatch(id);
  }
}
