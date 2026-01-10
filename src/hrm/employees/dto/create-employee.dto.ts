import { IsString, IsOptional, IsUUID, IsDateString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
    @ApiProperty({ description: 'Unique employee code', example: 'EMP-001' })
    @IsString()
    employeeCode: string;

    @ApiProperty({ description: 'Full name', example: 'Ahmed Khan' })
    @IsString()
    fullName: string;

    @ApiProperty({ description: 'CNIC or Passport number', example: '12345-1234567-1' })
    @IsString()
    cnicPassport: string;

    @ApiProperty({ description: 'Date of birth', example: '1990-01-15' })
    @IsDateString()
    dateOfBirth: string;

    @ApiPropertyOptional({ description: 'Gender', enum: ['Male', 'Female', 'Other'] })
    @IsEnum(['Male', 'Female', 'Other'])
    @IsOptional()
    gender?: 'Male' | 'Female' | 'Other';

    @ApiProperty({ description: 'Department ID' })
    @IsUUID()
    departmentId: string;

    @ApiProperty({ description: 'Designation ID' })
    @IsUUID()
    designationId: string;

    @ApiProperty({ description: 'Joining date', example: '2024-01-01' })
    @IsDateString()
    joiningDate: string;

    @ApiPropertyOptional({ description: 'Employment type', enum: ['Permanent', 'Contract', 'Daily Wager'] })
    @IsEnum(['Permanent', 'Contract', 'Daily Wager'])
    @IsOptional()
    employmentType?: 'Permanent' | 'Contract' | 'Daily Wager';

    @ApiProperty({ description: 'Basic salary', example: 50000 })
    @IsNumber()
    basicSalary: number;

    @ApiPropertyOptional({ description: 'Bank account number' })
    @IsString()
    @IsOptional()
    bankAccount?: string;

    @ApiPropertyOptional({ description: 'Social security number' })
    @IsString()
    @IsOptional()
    socialSecurityNo?: string;
}
