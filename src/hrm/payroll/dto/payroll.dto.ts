import { IsNumber, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePayrollDto {
    @ApiProperty({ description: 'Month (1-12)', example: 1 })
    @IsNumber()
    month: number;

    @ApiProperty({ description: 'Year', example: 2024 })
    @IsNumber()
    year: number;
}

export class ProcessPayrollDto {
    @ApiPropertyOptional({ description: 'Tax deduction percentage', example: 5 })
    @IsNumber()
    @IsOptional()
    taxPercent?: number;

    @ApiPropertyOptional({ description: 'Overtime rate per hour', example: 500 })
    @IsNumber()
    @IsOptional()
    overtimeRate?: number;
}
