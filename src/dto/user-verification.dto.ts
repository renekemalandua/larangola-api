import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { DocumentType, VerificationStepStatus } from '@prisma/client';

export class SubmitVerificationRequestDTO {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  currentStep?: number;

  @ApiPropertyOptional({ example: 'DRAFT' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: '920000000' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  zonesOfOperation?: any;

  @ApiPropertyOptional({ enum: DocumentType })
  @IsOptional()
  @IsEnum(DocumentType)
  documentType?: DocumentType;

  @ApiPropertyOptional({ example: '123456789' })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiPropertyOptional({ example: '999999999' })
  @IsOptional()
  @IsString()
  nif?: string;
}

export class UpdateVerificationRequestDTO extends PartialType(
  SubmitVerificationRequestDTO
) {}

export class ReviewVerificationStepRequestDTO {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 1, description: '1 or 2' })
  step: number;

  @ApiProperty({ enum: VerificationStepStatus })
  @IsEnum(VerificationStepStatus)
  status: VerificationStepStatus;

  @ApiPropertyOptional({ example: 'Documento não está legível' })
  @IsOptional()
  @IsString()
  notes?: string;
}
