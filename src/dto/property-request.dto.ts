import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { PropertyRequestStatus } from '@prisma/client';

export class CreatePropertyRequestDTO {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'Procuro T3 no Talatona' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Com piscina e gerador' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Talatona, Luanda' })
  @IsString()
  location: string;

  @ApiProperty({ example: 'Apartment' })
  @IsString()
  propertyType: string;

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;
}

export class UpdatePropertyRequestDTO {
  @ApiPropertyOptional({ example: 'Procuro T4' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Sem mobília' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Viana' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: 'House' })
  @IsOptional()
  @IsString()
  propertyType?: string;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ example: 600000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bedrooms?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bathrooms?: number;

  @ApiPropertyOptional({
    enum: PropertyRequestStatus,
    example: PropertyRequestStatus.CLOSED,
  })
  @IsOptional()
  @IsEnum(PropertyRequestStatus)
  status?: PropertyRequestStatus;
}
