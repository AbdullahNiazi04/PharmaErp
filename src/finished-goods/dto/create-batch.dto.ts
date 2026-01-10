import { IsString, IsEnum, IsOptional, IsNumber, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFinishedGoodBatchDto {
    @ApiProperty()
    @IsUUID()
    itemId: string;

    @ApiProperty()
    @IsString()
    batchNumber: string;

    @ApiProperty()
    @IsDateString()
    mfgDate: string;

    @ApiProperty()
    @IsDateString()
    expiryDate: string;

    @ApiProperty()
    @IsNumber()
    quantityProduced: number;

    @ApiPropertyOptional({ enum: ['Released', 'Hold', 'Rejected'] })
    @IsOptional()
    @IsEnum(['Released', 'Hold', 'Rejected'])
    qcStatus?: 'Released' | 'Hold' | 'Rejected';

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    warehouseId?: string;
}
