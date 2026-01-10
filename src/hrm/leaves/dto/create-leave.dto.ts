import { IsString, IsOptional, IsUUID, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeaveDto {
    @ApiProperty({ description: 'Employee ID' })
    @IsUUID()
    employeeId: string;

    @ApiProperty({ description: 'Leave type', enum: ['Sick', 'Casual', 'Annual', 'Maternity'] })
    @IsEnum(['Sick', 'Casual', 'Annual', 'Maternity'])
    leaveType: 'Sick' | 'Casual' | 'Annual' | 'Maternity';

    @ApiProperty({ description: 'Start date', example: '2024-01-15' })
    @IsDateString()
    startDate: string;

    @ApiProperty({ description: 'End date', example: '2024-01-17' })
    @IsDateString()
    endDate: string;

    @ApiPropertyOptional({ description: 'Reason for leave' })
    @IsString()
    @IsOptional()
    reason?: string;
}
