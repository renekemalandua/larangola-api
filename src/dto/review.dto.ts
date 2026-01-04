import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';

export class CreateReviewRequestDTO {
	@ApiPropertyOptional({ example: 'uuid-of-listing' })
	@IsOptional()
	@IsUUID()
	listingId?: string;

	@ApiProperty({ example: 'uuid-of-from-user' })
	@IsUUID()
	fromUserId: string;

	@ApiProperty({ example: 'uuid-of-to-user' })
	@IsUUID()
	toUserId: string;

	@ApiProperty({ example: 5, minimum: 1, maximum: 5 })
	@IsInt()
	@Min(1)
	@Max(5)
	rating: number;

	@ApiPropertyOptional({ example: 'Excelente serviço!' })
	@IsOptional()
	@IsString()
	comment?: string;
}

export class UpdateReviewRequestDTO {
	@ApiPropertyOptional({ example: 5, minimum: 1, maximum: 5 })
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(5)
	rating?: number;

	@ApiPropertyOptional({ example: 'Excelente serviço!' })
	@IsOptional()
	@IsString()
	comment?: string;
}


