import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../shared';
import { UserVerificationEntity } from '../entities/user-verification.entity';
import { IUserVerificationRepository } from '../repositories/IUserVerificationRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IAgentRepository } from '../repositories/IAgentRepository';
import { IRoommateRepository } from '../repositories/IRoommateRepository';
import {
    SubmitVerificationRequestDTO,
    ReviewVerificationStepRequestDTO,
} from '../dto/user-verification.dto';
import { VerificationStepStatus } from '@prisma/client';

@Injectable()
export class RequestVerificationUseCase implements UseCase<
    { userId: string; data: SubmitVerificationRequestDTO },
    UserVerificationEntity
> {
    constructor(
        private readonly repository: IUserVerificationRepository,
        private readonly userRepository: IUserRepository,
        private readonly agentRepository: IAgentRepository,
        private readonly roommateRepository: IRoommateRepository
    ) { }

    async execute({
        userId,
        data,
    }: {
        userId: string;
        data: SubmitVerificationRequestDTO;
    }): Promise<UserVerificationEntity> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundException('User not found');

        const existing = await this.repository.findByUserId(userId);
        if (existing && existing.step1Status === VerificationStepStatus.APPROVED) {
            // If step 2 is null but user is agent, maybe we allow re-submission or just update.
            // For simplicity, if it's already approved at step 1, we might not want to overwrite everything
            // unless it's a re-verification.
        }

        // Check if user is Agent or Roommate to decide if step2 should be initialized
        const agent = await this.agentRepository.findByUserId(userId);
        const step2Status = agent ? VerificationStepStatus.PENDING : null;

        const entity = UserVerificationEntity.create({
            userId,
            documentType: data.documentType,
            documentNumber: data.documentNumber,
            nif: data.nif,
            documentFrontUrl: data.documentFrontUrl,
            documentBackUrl: data.documentBackUrl,
            selfieUrl: data.selfieUrl,
            videoUrl: data.videoUrl,
            step1Status: VerificationStepStatus.PENDING,
            step2Status,
        });

        if (existing) {
            // If already exists, we could either update or delete and re-create.
            // Repository update expect ID.
            await this.repository.delete(existing.id);
        }

        return this.repository.create(entity);
    }
}

@Injectable()
export class ReviewVerificationUseCase implements UseCase<
    { reviewerId: string; data: ReviewVerificationStepRequestDTO },
    UserVerificationEntity
> {
    constructor(
        private readonly repository: IUserVerificationRepository,
        private readonly agentRepository: IAgentRepository,
        private readonly roommateRepository: IRoommateRepository
    ) { }

    async execute({
        reviewerId,
        data,
    }: {
        reviewerId: string;
        data: ReviewVerificationStepRequestDTO;
    }): Promise<UserVerificationEntity> {
        const verification = await this.repository.findByUserId(data.userId);
        if (!verification) throw new NotFoundException('Verification request not found for this user');

        if (data.step === 1) {
            verification.step1Status = data.status;
            verification.step1ReviewedAt = new Date();
            verification.step1ReviewedBy = reviewerId;
        } else if (data.step === 2) {
            if (verification.step2Status === null) {
                throw new BadRequestException('Step 2 is not applicable for this user or was not initialized');
            }
            verification.step2Status = data.status;
            verification.step2ReviewedAt = new Date();
            verification.step2ReviewedBy = reviewerId;
            verification.step2Notes = data.notes ?? null;
        } else {
            throw new BadRequestException('Invalid step number');
        }

        const updated = await this.repository.update(verification);

        // Dynamic update of isVerified status
        await this.syncVerifiedStatus(data.userId, updated);

        return updated;
    }

    private async syncVerifiedStatus(userId: string, verification: UserVerificationEntity) {
        const roommate = await this.roommateRepository.findByUserId(userId);
        const agent = await this.agentRepository.findByUserId(userId);

        if (roommate) {
            // Roommate condition: Step 1 Approved
            const isVerified = verification.step1Status === VerificationStepStatus.APPROVED;
            if (roommate.isVerified !== isVerified) {
                roommate.isVerified = isVerified;
                await this.roommateRepository.update(roommate);
            }
        }

        if (agent) {
            // Agent condition: Step 1 AND Step 2 Approved
            const step1Approved = verification.step1Status === VerificationStepStatus.APPROVED;
            const step2Approved = verification.step2Status === VerificationStepStatus.APPROVED;
            const isVerified = step1Approved && step2Approved;

            if (agent.isVerified !== isVerified) {
                agent.isVerified = isVerified;
                await this.agentRepository.update(agent);
            }
        }
    }
}

@Injectable()
export class GetMyVerificationUseCase implements UseCase<string, UserVerificationEntity | null> {
    constructor(private readonly repository: IUserVerificationRepository) { }

    async execute(userId: string): Promise<UserVerificationEntity | null> {
        return this.repository.findByUserId(userId);
    }
}
