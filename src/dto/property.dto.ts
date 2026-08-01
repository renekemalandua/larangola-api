import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ListingType, PropertyStatus } from '../entities/property.entity';

export class CreatePropertyDTO {
  @ApiProperty({ example: 'uuid-of-agent' })
  @IsUUID()
  agentId: string;

  @ApiProperty({ example: 'uuid-of-category' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'T3 no Talatona' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Apartamento T3 com 2 suítes' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Rua 1, Bairro X' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Luanda' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Luanda' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'Angola' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: -8.838333 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 13.234444 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  area?: number;

  @ApiProperty({ example: 'apartment' })
  @IsString()
  propertyType: string;

  @ApiPropertyOptional({ example: ['Piscina', 'Estacionamento'] })
  @IsOptional()
  amenities?: string[];

  @ApiPropertyOptional({ example: ['https://.../1.jpg', 'https://.../2.jpg'] })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: ['Não fumar', 'Sem barulho após 22h'] })
  @IsOptional()
  @IsString({ each: true })
  rules?: string[];

  // Merged Listing Fields (Optional for Draft)
  @ApiPropertyOptional({ example: 'rent', enum: ListingType })
  @IsOptional()
  @IsEnum(ListingType)
  listingType?: ListingType;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 'AOA' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'draft', enum: PropertyStatus })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;
}

export class UpdatePropertyDTO {
  @ApiPropertyOptional({ example: 'uuid-of-new-category' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'Novo título' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Nova descrição' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Rua 2' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Benguela' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'Benguela' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'Angola' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: -8.83 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ example: 13.23 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({ example: 130 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  area?: number;

  @ApiPropertyOptional({ example: 'house' })
  @IsOptional()
  @IsString()
  propertyType?: string;

  @ApiPropertyOptional({ example: ['Piscina'] })
  @IsOptional()
  @IsString({ each: true })
  amenities?: string[];

  @ApiPropertyOptional({ example: ['https://.../1.jpg'] })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ example: ['Não fumar'] })
  @IsOptional()
  @IsString({ each: true })
  rules?: string[];

  @ApiPropertyOptional({ example: 'rent', enum: ListingType })
  @IsOptional()
  @IsEnum(ListingType)
  listingType?: ListingType;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 'AOA' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'published', enum: PropertyStatus })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;

  // Approval Fields
  @ApiPropertyOptional({ example: 'Preço acima do mercado' })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}


export class RequestPublicationDTO {
  @ApiProperty({ example: 'uuid-do-imovel' })
  @IsUUID()
  propertyId: string;
}
