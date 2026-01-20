import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePurchaseRequisitionDto } from './create-purchase-requisition.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdatePurchaseRequisitionDto extends PartialType(CreatePurchaseRequisitionDto) {
    @ApiPropertyOptional({ enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected', 'Converted'] })
    @IsOptional()
    @IsEnum(['Draft', 'Pending Approval', 'Approved', 'Rejected', 'Converted'])
    status?: 'Draft' | 'Pending Approval' | 'Approved' | 'Rejected' | 'Converted';
}
