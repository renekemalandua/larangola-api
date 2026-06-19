import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';

export class CreatePropertyAuditRequestDTO {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  area?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty()
  @IsString()
  propertyType: string;

  @ApiProperty()
  @IsString()
  listingType: string;

  @ApiPropertyOptional()
  @IsOptional()
  images?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePropertyAuditRequestDTO {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(['PENDING', 'VALIDATING', 'APPROVED', 'REJECTED', 'CANCELED'])
  status?: 'PENDING' | 'VALIDATING' | 'APPROVED' | 'REJECTED' | 'CANCELED';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  claimedByAgentId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  claimedAt?: Date;
}
