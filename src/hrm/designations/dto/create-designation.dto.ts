import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDesignationDto {
    @ApiProperty({ description: 'Job title', example: 'Quality Analyst' })
    @IsString()
    title: string;

    @ApiPropertyOptional({ description: 'Grade level', example: 'M1' })
    @IsString()
    @IsOptional()
    level?: string;
}
