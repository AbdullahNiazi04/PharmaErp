import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { FinishedGoodsService } from './finished-goods.service';
import { CreateFinishedGoodDto } from './dto/create-finished-good.dto';
import { CreateFinishedGoodBatchDto } from './dto/create-batch.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('finished-goods')
@Controller('finished-goods')
export class FinishedGoodsController {
  constructor(private readonly finishedGoodsService: FinishedGoodsService) { }

  // === Items CRUD ===
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createDto: CreateFinishedGoodDto) {
    return this.finishedGoodsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.finishedGoodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finishedGoodsService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updateDto: Partial<CreateFinishedGoodDto>) {
    return this.finishedGoodsService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finishedGoodsService.remove(id);
  }

  // === Batches CRUD ===
  @Post('batches')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  addBatch(@Body() createDto: CreateFinishedGoodBatchDto) {
    return this.finishedGoodsService.addBatch(createDto);
  }

  @Get('batches/all')
  getAllBatches() {
    return this.finishedGoodsService.getAllBatches();
  }

  @Get(':id/batches')
  getBatches(@Param('id') id: string) {
    return this.finishedGoodsService.getBatches(id);
  }

  @Patch('batches/:id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  updateBatch(@Param('id') id: string, @Body() updateDto: Partial<CreateFinishedGoodBatchDto>) {
    return this.finishedGoodsService.updateBatch(id, updateDto);
  }

  @Delete('batches/:id')
  removeBatch(@Param('id') id: string) {
    return this.finishedGoodsService.removeBatch(id);
  }
}

