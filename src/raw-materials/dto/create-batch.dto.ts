import { IsString, IsEnum, IsOptional, IsNumber, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRawMaterialBatchDto {
    @ApiProperty()
    @IsUUID()
    inventoryId: string;

    @ApiProperty()
    @IsString()
    batchNumber: string;

    @ApiProperty()
    @IsNumber()
    quantityAvailable: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    expiryDate?: string;

    @ApiPropertyOptional({ enum: ['Quarantine', 'Approved', 'Rejected'] })
    @IsOptional()
    @IsEnum(['Quarantine', 'Approved', 'Rejected'])
    qcStatus?: 'Quarantine' | 'Approved' | 'Rejected';

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    warehouseLocation?: string;
}
