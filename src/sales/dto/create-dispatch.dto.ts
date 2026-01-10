import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDispatchDto {
    @ApiProperty()
    @IsUUID()
    warehouseId: string;

    @ApiProperty()
    @IsString()
    transporter: string;
}
