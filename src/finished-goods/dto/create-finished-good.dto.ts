import { IsString, IsEnum, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFinishedGoodDto {
    @ApiProperty()
    @IsString()
    itemCode: string;

    @ApiProperty()
    @IsString()
    itemName: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    dosageForm?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    strength?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    packSize?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    shelfLife?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    mrp?: number;
}
