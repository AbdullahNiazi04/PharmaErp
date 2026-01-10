import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { FinishedGoodsService } from './finished-goods.service';
import { CreateFinishedGoodDto } from './dto/create-finished-good.dto';
import { CreateFinishedGoodBatchDto } from './dto/create-batch.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('finished-goods')
@Controller('finished-goods')
export class FinishedGoodsController {
  constructor(private readonly finishedGoodsService: FinishedGoodsService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createDto: CreateFinishedGoodDto) {
    return this.finishedGoodsService.create(createDto);
  }

  @Post('batches')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  addBatch(@Body() createDto: CreateFinishedGoodBatchDto) {
    return this.finishedGoodsService.addBatch(createDto);
  }

  @Get()
  findAll() {
    return this.finishedGoodsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.finishedGoodsService.findOne(id);
  }

  @Get(':id/batches')
  getBatches(@Param('id') id: string) {
    return this.finishedGoodsService.getBatches(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.finishedGoodsService.remove(id);
  }
}
