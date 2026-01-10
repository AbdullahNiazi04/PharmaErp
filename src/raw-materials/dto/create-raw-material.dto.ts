import { IsString, IsEnum, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRawMaterialDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    code: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: ['API', 'Excipient', 'Packaging'] })
    @IsEnum(['API', 'Excipient', 'Packaging'])
    type: 'API' | 'Excipient' | 'Packaging';

    @ApiProperty()
    @IsString()
    unitOfMeasure: string;
}

export class CreateRawMaterialInventoryDto {
    @ApiProperty()
    @IsUUID()
    materialId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    storageCondition?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    reorderLevel?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    safetyStock?: number;
}
