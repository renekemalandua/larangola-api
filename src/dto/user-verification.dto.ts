import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { DocumentType, VerificationStepStatus } from '@prisma/client';

export class SubmitVerificationRequestDTO {
    @ApiProperty({ enum: DocumentType })
    @IsEnum(DocumentType)
    documentType: DocumentType;

    @ApiProperty({ example: '123456789' })
    @IsString()
    documentNumber: string;

    @ApiPropertyOptional({ example: '999999999' })
    @IsOptional()
    @IsString()
    nif?: string;

    @ApiProperty({ example: 'https://storage.com/front.jpg' })
    @IsUrl()
    documentFrontUrl: string;

    @ApiProperty({ example: 'https://storage.com/back.jpg' })
    @IsUrl()
    documentBackUrl: string;

    @ApiProperty({ example: 'https://storage.com/selfie.jpg' })
    @IsUrl()
    selfieUrl: string;

    @ApiProperty({ example: 'https://storage.com/video.mp4' })
    @IsUrl()
    videoUrl: string;
}

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
