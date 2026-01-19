import { UserVerification } from '@prisma/client';
import { UserVerificationEntity } from '../entities/user-verification.entity';
import { IdValueObject } from '../shared';

export class UserVerificationAdapter {
    static toDomain(raw: UserVerification): UserVerificationEntity {
        return UserVerificationEntity.create(
            {
                userId: raw.userId,
                documentType: raw.documentType,
                documentNumber: raw.documentNumber,
                nif: raw.nif,
                documentFrontUrl: raw.documentFrontUrl,
                documentBackUrl: raw.documentBackUrl,
                selfieUrl: raw.selfieUrl,
                videoUrl: raw.videoUrl,
                step1Status: raw.step1Status,
                step1ReviewedAt: raw.step1ReviewedAt,
                step1ReviewedBy: raw.step1ReviewedBy,
                step2Status: raw.step2Status,
                step2ReviewedAt: raw.step2ReviewedAt,
                step2ReviewedBy: raw.step2ReviewedBy,
                step2Notes: raw.step2Notes,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new IdValueObject(raw.id)
        );
    }

    static toPrisma(entity: UserVerificationEntity): UserVerification {
        return {
            id: entity.id,
            userId: entity.userId,
            documentType: entity.documentType,
            documentNumber: entity.documentNumber,
            nif: entity.nif,
            documentFrontUrl: entity.documentFrontUrl,
            documentBackUrl: entity.documentBackUrl,
            selfieUrl: entity.selfieUrl,
            videoUrl: entity.videoUrl,
            step1Status: entity.step1Status,
            step1ReviewedAt: entity.step1ReviewedAt,
            step1ReviewedBy: entity.step1ReviewedBy,
            step2Status: entity.step2Status,
            step2ReviewedAt: entity.step2ReviewedAt,
            step2ReviewedBy: entity.step2ReviewedBy,
            step2Notes: entity.step2Notes,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }

    static toHttp(entity: UserVerificationEntity): any {
        return {
            id: entity.id,
            userId: entity.userId,
            documentType: entity.documentType,
            documentNumber: entity.documentNumber,
            nif: entity.nif,
            documentFrontUrl: entity.documentFrontUrl,
            documentBackUrl: entity.documentBackUrl,
            selfieUrl: entity.selfieUrl,
            videoUrl: entity.videoUrl,
            step1Status: entity.step1Status,
            step1ReviewedAt: entity.step1ReviewedAt,
            step1ReviewedBy: entity.step1ReviewedBy,
            step2Status: entity.step2Status,
            step2ReviewedAt: entity.step2ReviewedAt,
            step2ReviewedBy: entity.step2ReviewedBy,
            step2Notes: entity.step2Notes,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}
