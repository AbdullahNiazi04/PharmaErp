import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
    @ApiPropertyOptional({ description: 'Employee status', enum: ['Active', 'On Leave', 'Terminated', 'Resigned'] })
    @IsEnum(['Active', 'On Leave', 'Terminated', 'Resigned'])
    @IsOptional()
    status?: 'Active' | 'On Leave' | 'Terminated' | 'Resigned';
}
