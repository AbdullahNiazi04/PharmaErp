import { IsString, IsDateString, IsEnum, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvoiceDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    invoiceNumber?: string;

    @ApiProperty()
    @IsDateString()
    invoiceDate: string;

    @ApiProperty()
    @IsUUID()
    vendorId: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    poId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    grnId?: string;

    @ApiProperty()
    @IsNumber()
    amount: number;

    @ApiProperty()
    @IsDateString()
    dueDate: string;

    @ApiPropertyOptional({ enum: ['Pending', 'Paid', 'Overdue', 'Cancelled'] })
    @IsOptional()
    @IsEnum(['Pending', 'Paid', 'Overdue', 'Cancelled'])
    status?: 'Pending' | 'Paid' | 'Overdue' | 'Cancelled';
}
