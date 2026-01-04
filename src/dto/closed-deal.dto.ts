import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ClosedDealStatus } from '../entities/closed-deal.entity';

export class CreateClosedDealRequestDTO {
	@ApiProperty({ example: 'uuid-of-listing' })
	@IsUUID()
	listingId: string;

	@ApiProperty({ example: 'uuid-of-agent' })
	@IsUUID()
	agentId: string;

	@ApiProperty({ example: 'uuid-of-client' })
	@IsUUID()
	clientId: string;

	@ApiProperty({ example: 7500 })
	@IsNumber()
	@Min(0)
	commissionAmount: number;

	@ApiProperty({ example: 5 })
	@IsNumber()
	@Min(0)
	commissionRate: number;

	@ApiProperty({ example: '2024-01-28' })
	@IsDateString()
	closedDate: string;

	@ApiPropertyOptional({ example: 'pending_payment', enum: ClosedDealStatus })
	@IsOptional()
	@IsEnum(ClosedDealStatus)
	status?: ClosedDealStatus;
}

export class UpdateClosedDealRequestDTO {
	@ApiPropertyOptional({ example: 7500 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	commissionAmount?: number;

	@ApiPropertyOptional({ example: 5 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	commissionRate?: number;

	@ApiPropertyOptional({ example: 'completed', enum: ClosedDealStatus })
	@IsOptional()
	@IsEnum(ClosedDealStatus)
	status?: ClosedDealStatus;

	@ApiPropertyOptional({ example: '2024-01-28' })
	@IsOptional()
	@IsDateString()
	closedDate?: string;
}


