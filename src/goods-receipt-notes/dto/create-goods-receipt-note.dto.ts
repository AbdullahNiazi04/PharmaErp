import { IsString, IsDateString, IsEnum, IsOptional, IsNumber, ValidateNested, IsArray, IsUUID, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CreateGoodsReceiptItemDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    itemCode?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    itemName?: string;

    @ApiProperty()
    @IsNumber()
    orderedQty: number;

    @ApiProperty()
    @IsNumber()
    receivedQty: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    rejectedQty?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    batchNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    mfgDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    expiryDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    storageCondition?: string;
}

export class CreateGoodsReceiptNoteDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    grnNumber?: string;

    @ApiProperty()
    @IsDateString()
    grnDate: string;

    @ApiProperty()
    @IsUUID()
    poId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    warehouseLocation?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    receivedBy?: string;

    // QC Logic
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    qcRequired?: boolean;

    @ApiPropertyOptional({ enum: ['Pending', 'Passed', 'Failed', 'Skipped'] })
    @IsOptional()
    @IsEnum(['Pending', 'Passed', 'Failed', 'Skipped'])
    qcStatus?: 'Pending' | 'Passed' | 'Failed' | 'Skipped';

    @ApiPropertyOptional({ enum: ['Normal', 'Urgent', 'ASAP'] })
    @IsOptional()
    @IsEnum(['Normal', 'Urgent', 'ASAP'])
    urgencyStatus?: 'Normal' | 'Urgent' | 'ASAP';

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    qcIntimationDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    qcRemarks?: string;
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    attachments?: string[];

    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    importDocuments?: string[];

    // Inventory Logic
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    stockPosted?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    inventoryLocation?: string;

    @ApiProperty({ type: [CreateGoodsReceiptItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateGoodsReceiptItemDto)
    items: CreateGoodsReceiptItemDto[];
}
