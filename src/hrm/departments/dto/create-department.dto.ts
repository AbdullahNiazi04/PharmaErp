import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
    @ApiProperty({ description: 'Department name', example: 'Quality Control' })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: 'Manager employee ID' })
    @IsUUID()
    @IsOptional()
    managerId?: string;
}
