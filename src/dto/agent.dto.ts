import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';

export class CreateAgentRequestDTO {
	@ApiProperty({ example: 'uuid-of-user' })
	@IsUUID()
	userId: string;

	@ApiPropertyOptional({ example: 'Agente Imobiliário' })
	@IsOptional()
	@IsString()
	profession?: string;

	@ApiPropertyOptional({ example: 'Imobiliária Premium' })
	@IsOptional()
	@IsString()
	company?: string;

	@ApiPropertyOptional({ example: 'Luanda' })
	@IsOptional()
	@IsString()
	location?: string;

	@ApiPropertyOptional({ example: 'Especialista em imóveis de luxo' })
	@IsOptional()
	@IsString()
	bio?: string;

	@ApiPropertyOptional({ example: 'Agente com mais de 15 anos de experiência' })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({ example: false })
	@IsOptional()
	@IsBoolean()
	isVerified?: boolean;
}

export class UpdateAgentRequestDTO {
	@ApiPropertyOptional({ example: 'Agente Imobiliário' })
	@IsOptional()
	@IsString()
	profession?: string;

	@ApiPropertyOptional({ example: 'Imobiliária Premium' })
	@IsOptional()
	@IsString()
	company?: string;

	@ApiPropertyOptional({ example: 'Luanda' })
	@IsOptional()
	@IsString()
	location?: string;

	@ApiPropertyOptional({ example: 'Especialista em imóveis de luxo' })
	@IsOptional()
	@IsString()
	bio?: string;

	@ApiPropertyOptional({ example: 'Agente com mais de 15 anos de experiência' })
	@IsOptional()
	@IsString()
	description?: string;

	@ApiPropertyOptional({ example: true })
	@IsOptional()
	@IsBoolean()
	isVerified?: boolean;

	@ApiPropertyOptional({ example: 95 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(100)
	responseRate?: number;

	@ApiPropertyOptional({ example: '2 horas' })
	@IsOptional()
	@IsString()
	averageResponseTime?: string;

	@ApiPropertyOptional({ example: 24 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	propertiesCount?: number;

	@ApiPropertyOptional({ example: 4.7 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(5)
	averageRating?: number;
}

