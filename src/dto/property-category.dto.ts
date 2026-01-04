import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreatePropertyCategoryRequestDTO {
	@ApiProperty({ example: 'Apartamento' })
	@IsString()
	name: string;

	@ApiPropertyOptional({ example: 'Apartamentos e condomínios' })
	@IsOptional()
	@IsString()
	description?: string;
}

export class UpdatePropertyCategoryRequestDTO {
	@ApiPropertyOptional({ example: 'Casa' })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiPropertyOptional({ example: 'Casas e moradias' })
	@IsOptional()
	@IsString()
	description?: string;
}


