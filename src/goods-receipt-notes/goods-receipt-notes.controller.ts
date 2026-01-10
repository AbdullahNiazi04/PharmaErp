import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { GoodsReceiptNotesService } from './goods-receipt-notes.service';
import { CreateGoodsReceiptNoteDto } from './dto/create-goods-receipt-note.dto';
import { UpdateGoodsReceiptNoteDto } from './dto/update-goods-receipt-note.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('goods-receipt-notes')
@Controller('goods-receipt-notes')
export class GoodsReceiptNotesController {
  constructor(private readonly goodsReceiptNotesService: GoodsReceiptNotesService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createGoodsReceiptNoteDto: CreateGoodsReceiptNoteDto) {
    return this.goodsReceiptNotesService.create(createGoodsReceiptNoteDto);
  }

  @Get()
  findAll() {
    return this.goodsReceiptNotesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodsReceiptNotesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoodsReceiptNoteDto: UpdateGoodsReceiptNoteDto) {
    return this.goodsReceiptNotesService.update(id, updateGoodsReceiptNoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.goodsReceiptNotesService.remove(id);
  }
}
