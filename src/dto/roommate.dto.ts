import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';

export class CreateRoommateRequestDTO {
	@ApiProperty({ example: 'uuid-of-user' })
	@IsUUID()
	userId: string;

	@ApiPropertyOptional({ example: 28 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	age?: number;

	@ApiPropertyOptional({ example: 'Engenheiro de Software' })
	@IsOptional()
	@IsString()
	profession?: string;

	@ApiPropertyOptional({ example: 'Tech Angola' })
	@IsOptional()
	@IsString()
	company?: string;

	@ApiPropertyOptional({ example: 'Luanda, Maianga' })
	@IsOptional()
	@IsString()
	location?: string;

	@ApiPropertyOptional({ example: 30000 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	budget?: number;

	@ApiPropertyOptional({ example: '2024-03-01' })
	@IsOptional()
	@IsDateString()
	moveInDate?: string;

	@ApiPropertyOptional({ example: 'Profissional tranquila, gosto de ler' })
	@IsOptional()
	@IsString()
	bio?: string;

	@ApiPropertyOptional({ example: false })
	@IsOptional()
	@IsBoolean()
	isVerified?: boolean;

	@ApiPropertyOptional({ example: true })
	@IsOptional()
	@IsBoolean()
	lookingForRoommate?: boolean;

	@ApiPropertyOptional({ example: { smoking: false, pets: false } })
	@IsOptional()
	preferences?: unknown;

	@ApiPropertyOptional({ example: { workSchedule: '09:00 - 18:00' } })
	@IsOptional()
	lifestyle?: unknown;

	@ApiPropertyOptional({ example: ['Leitura', 'Yoga'] })
	@IsOptional()
	interests?: unknown;

	@ApiPropertyOptional({ example: ['Português', 'Inglês'] })
	@IsOptional()
	languages?: unknown;
}

export class UpdateRoommateRequestDTO {
	@ApiPropertyOptional({ example: 28 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	age?: number;

	@ApiPropertyOptional({ example: 'Engenheiro de Software' })
	@IsOptional()
	@IsString()
	profession?: string;

	@ApiPropertyOptional({ example: 'Tech Angola' })
	@IsOptional()
	@IsString()
	company?: string;

	@ApiPropertyOptional({ example: 'Luanda, Maianga' })
	@IsOptional()
	@IsString()
	location?: string;

	@ApiPropertyOptional({ example: 30000 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	budget?: number;

	@ApiPropertyOptional({ example: '2024-03-01' })
	@IsOptional()
	@IsDateString()
	moveInDate?: string;

	@ApiPropertyOptional({ example: 'Profissional tranquila, gosto de ler' })
	@IsOptional()
	@IsString()
	bio?: string;

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

	@ApiPropertyOptional({ example: 4.8 })
	@IsOptional()
	@IsNumber()
	@Min(0)
	@Max(5)
	rating?: number;

	@ApiPropertyOptional({ example: true })
	@IsOptional()
	@IsBoolean()
	lookingForRoommate?: boolean;

	@ApiPropertyOptional({ example: { smoking: false, pets: false } })
	@IsOptional()
	preferences?: unknown;

	@ApiPropertyOptional({ example: { workSchedule: '09:00 - 18:00' } })
	@IsOptional()
	lifestyle?: unknown;

	@ApiPropertyOptional({ example: ['Leitura', 'Yoga'] })
	@IsOptional()
	interests?: unknown;

	@ApiPropertyOptional({ example: ['Português', 'Inglês'] })
	@IsOptional()
	languages?: unknown;
}


