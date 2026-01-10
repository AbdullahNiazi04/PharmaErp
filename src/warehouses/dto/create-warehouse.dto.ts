import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWarehouseDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ enum: ['Normal', 'Cold Chain'] })
    @IsOptional()
    @IsEnum(['Normal', 'Cold Chain'])
    type?: 'Normal' | 'Cold Chain';

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    location?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    temperatureRange?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    humidityRange?: string;
}
