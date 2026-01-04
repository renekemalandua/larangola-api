import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePropertyInterestRequestDTO {
	@ApiProperty({ example: 'uuid-of-listing' })
	@IsUUID()
	listingId: string;

	@ApiProperty({ example: 'uuid-of-user' })
	@IsUUID()
	userId: string;

	@ApiPropertyOptional({ example: 'Tenho interesse neste imóvel' })
	@IsOptional()
	@IsString()
	message?: string;
}

export class UpdatePropertyInterestRequestDTO {
	@ApiPropertyOptional({ example: 'Tenho interesse neste imóvel' })
	@IsOptional()
	@IsString()
	message?: string;
}


