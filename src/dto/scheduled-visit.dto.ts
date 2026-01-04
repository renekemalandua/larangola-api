import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { VisitStatus } from '../entities/scheduled-visit.entity';

export class CreateScheduledVisitRequestDTO {
  @ApiProperty({ example: 'uuid-of-listing' })
  @IsUUID()
  listingId: string;

  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: '2024-02-15' })
  @IsDateString()
  scheduledDate: string;

  @ApiProperty({ example: '14:00' })
  @IsString()
  scheduledTime: string;

  @ApiPropertyOptional({ example: 'pending', enum: VisitStatus })
  @IsOptional()
  @IsEnum(VisitStatus)
  status?: VisitStatus;

  @ApiPropertyOptional({
    example: 'Por favor, confirmar presença 1 hora antes',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateScheduledVisitRequestDTO {
  @ApiPropertyOptional({ example: '2024-02-15' })
  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @ApiPropertyOptional({ example: '14:00' })
  @IsOptional()
  @IsString()
  scheduledTime?: string;

  @ApiPropertyOptional({ example: 'confirmed', enum: VisitStatus })
  @IsOptional()
  @IsEnum(VisitStatus)
  status?: VisitStatus;

  @ApiPropertyOptional({ example: 'Confirmado' })
  @IsOptional()
  @IsString()
  notes?: string;
}
