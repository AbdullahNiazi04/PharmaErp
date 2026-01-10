import { IsString, IsOptional, IsUUID, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAttendanceDto {
    @ApiProperty({ description: 'Employee ID' })
    @IsUUID()
    employeeId: string;

    @ApiProperty({ description: 'Attendance date', example: '2024-01-15' })
    @IsDateString()
    date: string;

    @ApiPropertyOptional({ description: 'Check-in time' })
    @IsString()
    @IsOptional()
    checkIn?: string;

    @ApiPropertyOptional({ description: 'Check-out time' })
    @IsString()
    @IsOptional()
    checkOut?: string;

    @ApiPropertyOptional({ description: 'Attendance status', enum: ['Present', 'Absent', 'Late', 'Half-Day'] })
    @IsEnum(['Present', 'Absent', 'Late', 'Half-Day'])
    @IsOptional()
    status?: 'Present' | 'Absent' | 'Late' | 'Half-Day';

    @ApiPropertyOptional({ description: 'Overtime hours', example: 2 })
    @IsNumber()
    @IsOptional()
    overtimeHours?: number;

    @ApiPropertyOptional({ description: 'Remarks' })
    @IsString()
    @IsOptional()
    remarks?: string;
}
