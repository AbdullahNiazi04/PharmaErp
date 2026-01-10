import { PartialType } from '@nestjs/swagger';
import { CreateSalesOrderDto } from './create-sale.dto';

export class UpdateSaleDto extends PartialType(CreateSalesOrderDto) { }
