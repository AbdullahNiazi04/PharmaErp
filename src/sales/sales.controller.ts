import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSalesOrderDto } from './dto/create-sale.dto';
import { CreateDispatchDto } from './dto/create-dispatch.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) { }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createDto: CreateSalesOrderDto) {
    return this.salesService.create(createDto);
  }

  @Post(':id/dispatch')
  dispatch(@Param('id') id: string, @Body() dto: CreateDispatchDto) {
    return this.salesService.createDispatch(id, dto.warehouseId, dto.transporter);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(id);
  }
}
