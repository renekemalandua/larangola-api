import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PlanType } from '../entities/agent-plan.entity';

export class CreateAgentPlanRequestDTO {
	@ApiProperty({ example: 'basic', enum: PlanType })
	@IsEnum(PlanType)
	type: PlanType;

	@ApiProperty({ example: 'Básico' })
	@IsString()
	name: string;

	@ApiProperty({ example: 0 })
	@IsNumber()
	@Min(0)
	price: number;

	@ApiPropertyOptional({ example: 'month' })
	@IsOptional()
	@IsString()
	pricePeriod?: string;

	@ApiPropertyOptional({ example: 'Plano gratuito para começar' })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({ example: ['10 anúncios por semana'] })
	@IsOptional()
	features?: unknown;

	@ApiPropertyOptional({ example: false })
	@IsOptional()
	@IsBoolean()
	isPopular?: boolean;

	@ApiPropertyOptional({ example: 'Mais Popular' })
	@IsOptional()
	@IsString()
	badge?: string;
}

export class UpdateAgentPlanRequestDTO {
	@ApiPropertyOptional({ example: 'Básico' })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({ example: 0 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	price?: number;

	@ApiPropertyOptional({ example: 'month' })
	@IsOptional()
	@IsString()
	pricePeriod?: string;

	@ApiPropertyOptional({ example: 'Plano gratuito para começar' })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({ example: ['10 anúncios por semana'] })
	@IsOptional()
	features?: unknown;

	@ApiPropertyOptional({ example: false })
	@IsOptional()
	@IsBoolean()
	isPopular?: boolean;

	@ApiPropertyOptional({ example: 'Mais Popular' })
	@IsOptional()
	@IsString()
	badge?: string;
}

