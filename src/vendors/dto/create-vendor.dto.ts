import { IsBoolean, IsDateString, IsEnum, IsNumber, IsOptional, IsString, IsUrl, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVendorDto {
    @ApiProperty()
    @IsString()
    legalName: string;

    @ApiPropertyOptional({ enum: ['Raw Material', 'Packaging', 'Services', 'Equipment'] })
    @IsOptional()
    @IsEnum(['Raw Material', 'Packaging', 'Services', 'Equipment'])
    vendorType?: 'Raw Material' | 'Packaging' | 'Services' | 'Equipment';

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    businessCategory?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    registrationNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    ntnVatGst?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    city?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    address?: string;

    @ApiPropertyOptional({ enum: ['Active', 'Inactive', 'Blacklisted'] })
    @IsOptional()
    @IsEnum(['Active', 'Inactive', 'Blacklisted'])
    status?: 'Active' | 'Inactive' | 'Blacklisted';

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    contactPerson?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    contactNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUrl()
    website?: string;

    // Compliance
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isGmpCertified?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    isBlacklisted?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    regulatoryLicense?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    licenseExpiryDate?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    qualityRating?: number;

    @ApiPropertyOptional({ enum: ['Pending', 'Cleared', 'Failed'] })
    @IsOptional()
    @IsEnum(['Pending', 'Cleared', 'Failed'])
    auditStatus?: 'Pending' | 'Cleared' | 'Failed';

    @ApiPropertyOptional({ enum: ['Low', 'Medium', 'High'] })
    @IsOptional()
    @IsEnum(['Low', 'Medium', 'High'])
    riskCategory?: 'Low' | 'Medium' | 'High';

    // Financial
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    bankName?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    accountTitle?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    accountNumber?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    currency?: string;

    @ApiPropertyOptional({ enum: ['Net-30', 'Net-60', 'Advanced'] })
    @IsOptional()
    @IsEnum(['Net-30', 'Net-60', 'Advanced'])
    paymentTerms?: 'Net-30' | 'Net-60' | 'Advanced';

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    creditLimit?: number; // handle as number in DTO, string in DB

    @ApiPropertyOptional()
    @IsOptional()
    @IsNumber()
    taxWithholdingPercent?: number; // handle as number in DTO, string in DB
}
