import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { SubscriptionStatus } from '../entities/agent-subscription.entity';

export class CreateAgentSubscriptionRequestDTO {
	@ApiProperty({ example: 'uuid-of-agent' })
	@IsUUID()
	agentId: string;

	@ApiProperty({ example: 'uuid-of-plan' })
	@IsUUID()
	planId: string;

	@ApiProperty({ example: '2024-01-01' })
	@IsDateString()
	startDate: string;

	@ApiPropertyOptional({ example: '2024-02-01' })
	@IsOptional()
	@IsDateString()
	endDate?: string;

	@ApiPropertyOptional({ example: 'active', enum: SubscriptionStatus })
	@IsOptional()
	@IsEnum(SubscriptionStatus)
	status?: SubscriptionStatus;
}

export class UpdateAgentSubscriptionRequestDTO {
	@ApiPropertyOptional({ example: '2024-02-01' })
	@IsOptional()
	@IsDateString()
	endDate?: string;

	@ApiPropertyOptional({ example: 'active', enum: SubscriptionStatus })
	@IsOptional()
	@IsEnum(SubscriptionStatus)
	status?: SubscriptionStatus;
}

