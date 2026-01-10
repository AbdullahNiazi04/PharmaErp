import { IsString, IsDateString, IsEnum, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentDto {
    @ApiProperty()
    @IsUUID()
    invoiceId: string;

    @ApiProperty()
    @IsDateString()
    paymentDate: string;

    @ApiPropertyOptional({ enum: ['Bank Transfer', 'Cheque', 'Cash', 'Credit Card'] })
    @IsOptional()
    @IsEnum(['Bank Transfer', 'Cheque', 'Cash', 'Credit Card'])
    paymentMethod?: 'Bank Transfer' | 'Cheque' | 'Cash' | 'Credit Card';

    @ApiProperty()
    @IsNumber()
    amountPaid: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    taxWithheld?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    advanceAdjustments?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    paymentReference?: string;

    @ApiPropertyOptional({ enum: ['Pending', 'Completed', 'Failed'] })
    @IsOptional()
    @IsEnum(['Pending', 'Completed', 'Failed'])
    status?: 'Pending' | 'Completed' | 'Failed';
}
