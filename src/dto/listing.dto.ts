import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ListingType, ListingStatus } from '../entities/listing.entity';

export class CreateListingRequestDTO {
  @ApiProperty({ example: 'uuid-of-property' })
  @IsUUID()
  propertyId: string;

  @ApiProperty({ example: 'uuid-of-owner' })
  @IsUUID()
  ownerId: string;

  @ApiProperty({ example: 'rent', enum: ListingType })
  @IsEnum(ListingType)
  listingType: ListingType;

  @ApiProperty({ example: 150000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'AOA' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'draft', enum: ListingStatus })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @ApiProperty({ example: 'agent' })
  @IsString()
  listedBy: string;

  @ApiPropertyOptional({ example: 'uuid-of-agent' })
  @IsOptional()
  @IsUUID()
  agentId?: string;
}

export class UpdateListingRequestDTO {
  @ApiPropertyOptional({ example: 'rent', enum: ListingType })
  @IsOptional()
  @IsEnum(ListingType)
  listingType?: ListingType;

  @ApiPropertyOptional({ example: 150000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 'AOA' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ example: 'published', enum: ListingStatus })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @ApiPropertyOptional({ example: 'agent' })
  @IsOptional()
  @IsString()
  listedBy?: string;

  @ApiPropertyOptional({ example: 'uuid-of-agent' })
  @IsOptional()
  @IsUUID()
  agentId?: string;
}
