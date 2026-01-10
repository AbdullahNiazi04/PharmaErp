import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateLeaveDto {
    @ApiPropertyOptional({ description: 'Leave status', enum: ['Pending', 'Approved', 'Rejected'] })
    @IsEnum(['Pending', 'Approved', 'Rejected'])
    @IsOptional()
    status?: 'Pending' | 'Approved' | 'Rejected';

    @ApiPropertyOptional({ description: 'Approved by employee ID' })
    @IsUUID()
    @IsOptional()
    approvedBy?: string;
}
