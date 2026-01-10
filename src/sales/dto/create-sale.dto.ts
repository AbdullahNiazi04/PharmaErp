import { IsString, IsDateString, IsEnum, IsOptional, IsNumber, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSalesOrderItemDto {
    @ApiProperty()
    @IsUUID()
    itemId: string;

    @ApiProperty()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsNumber()
    unitPrice: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    discount?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    tax?: number;
}

export class CreateSalesOrderDto {
    @ApiProperty()
    @IsUUID()
    customerId: string;

    @ApiProperty()
    @IsDateString()
    orderDate: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    deliveryDate?: string;

    @ApiProperty({ type: [CreateSalesOrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSalesOrderItemDto)
    items: CreateSalesOrderItemDto[];
}
