import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UseCase } from '../shared';
import { UserVerificationEntity } from '../entities/user-verification.entity';
import { IUserVerificationRepository } from '../repositories/IUserVerificationRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IAgentRepository } from '../repositories/IAgentRepository';
import { IRoommateRepository } from '../repositories/IRoommateRepository';
import {
  SubmitVerificationRequestDTO,
  ReviewVerificationStepRequestDTO,
  UpdateVerificationRequestDTO,
} from '../dto/user-verification.dto';
import { VerificationStepStatus, NotificationType } from '@prisma/client';
import { CreateNotificationUseCase } from './notification.usecases';

import { IUploadService } from '../shared/services/IUploadService';

@Injectable()
export class RequestVerificationUseCase implements UseCase<
  {
    userId: string;
    data: SubmitVerificationRequestDTO;
    files: { [key: string]: Express.Multer.File[] };
  },
  UserVerificationEntity
> {
  constructor(
    private readonly repository: IUserVerificationRepository,
    private readonly userRepository: IUserRepository,
    private readonly agentRepository: IAgentRepository,
    private readonly roommateRepository: IRoommateRepository,
    private readonly uploadService: IUploadService
  ) {}

  async execute({
    userId,
    data,
    files,
  }: {
    userId: string;
    data: SubmitVerificationRequestDTO;
    files: { [key: string]: Express.Multer.File[] };
  }): Promise<UserVerificationEntity> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // Verify required files
    if (
      !files.documentFront?.[0] ||
      !files.documentBack?.[0] ||
      !files.selfie?.[0] ||
      !files.video?.[0]
    ) {
      throw new BadRequestException(
        'Todos os documentos (Frente, Verso, Selfie e Vídeo) são obrigatórios.'
      );
    }

    const documentFrontUrl = await this.uploadService.uploadImage(
      'verifications',
      files.documentFront[0]
    );
    const documentBackUrl = await this.uploadService.uploadImage(
      'verifications',
      files.documentBack[0]
    );
    const selfieUrl = await this.uploadService.uploadImage(
      'verifications',
      files.selfie[0]
    );
    const videoUrl = await this.uploadService.uploadVideo(
      files.video[0],
      'verifications'
    );

    const existing = await this.repository.findByUserId(userId);

    // Check if user is Agent or Roommate to decide if step2 should be initialized
    const agent = await this.agentRepository.findByUserId(userId);
    const step2Status = agent ? VerificationStepStatus.PENDING : null;

    const entity = UserVerificationEntity.create({
      userId,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      nif: data.nif,
      documentFrontUrl,
      documentBackUrl,
      selfieUrl,
      videoUrl,
      step1Status: VerificationStepStatus.PENDING,
      step2Status,
    });

    if (existing) {
      await this.repository.delete(existing.id);
    }

    return this.repository.create(entity);
  }
}

@Injectable()
export class UpdateVerificationUseCase implements UseCase<
  {
    userId: string;
    data: UpdateVerificationRequestDTO;
    files?: { [key: string]: Express.Multer.File[] };
  },
  UserVerificationEntity
> {
  constructor(
    private readonly repository: IUserVerificationRepository,
    private readonly uploadService: IUploadService,
    private readonly agentRepository: IAgentRepository
  ) {}

  async execute({
    userId,
    data,
    files,
  }: {
    userId: string;
    data: UpdateVerificationRequestDTO;
    files?: { [key: string]: Express.Multer.File[] };
  }): Promise<UserVerificationEntity> {
    let verification = await this.repository.findByUserId(userId);
    
    if (!verification) {
      verification = UserVerificationEntity.create({
        userId,
        currentStep: data.currentStep ?? 1,
        status: data.status ?? 'DRAFT',
        phone: data.phone ?? null,
        zonesOfOperation: data.zonesOfOperation ?? null,
        documentType: data.documentType ?? null,
        documentNumber: data.documentNumber ?? null,
        nif: data.nif ?? null,
        documentFrontUrl: null,
        documentBackUrl: null,
        selfieUrl: null,
        videoUrl: null,
        step1Status: VerificationStepStatus.PENDING,
      });
    } else {
      if (data.currentStep) verification.currentStep = data.currentStep;
      if (data.status) verification.status = data.status;
      if (data.phone) verification.phone = data.phone;
      if (data.zonesOfOperation) verification.zonesOfOperation = data.zonesOfOperation;
      if (data.documentType) verification.documentType = data.documentType;
      if (data.documentNumber) verification.documentNumber = data.documentNumber;
      if (data.nif) verification.nif = data.nif;
    }

    if (files) {
      if (files.documentFront?.[0]) {
        verification.documentFrontUrl = await this.uploadService.uploadImage(
          'verifications',
          files.documentFront[0]
        );
      }
      if (files.documentBack?.[0]) {
        verification.documentBackUrl = await this.uploadService.uploadImage(
          'verifications',
          files.documentBack[0]
        );
      }
      if (files.selfie?.[0]) {
        verification.selfieUrl = await this.uploadService.uploadImage(
          'verifications',
          files.selfie[0]
        );
      }
      if (files.video?.[0]) {
        verification.videoUrl = await this.uploadService.uploadVideo(
          files.video[0],
          'verifications'
        );
      }
    }

    const isNew = !verification.id || verification.id.includes('-'); // Rough check, repository should handle it
    
    // If it's the final submit, make sure status is PENDING
    if (verification.status === 'PENDING') {
        verification.step1Status = VerificationStepStatus.PENDING;
        if (verification.step2Status) {
            verification.step2Status = VerificationStepStatus.PENDING;
        }
    }

    if (!await this.repository.findByUserId(userId)) {
        return this.repository.create(verification);
    }
    
    return this.repository.update(verification);
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
    private readonly roommateRepository: IRoommateRepository,
    private readonly createNotificationUseCase: CreateNotificationUseCase
  ) {}

  async execute({
    reviewerId,
    data,
  }: {
    reviewerId: string;
    data: ReviewVerificationStepRequestDTO;
  }): Promise<UserVerificationEntity> {
    const verification = await this.repository.findByUserId(data.userId);
    if (!verification)
      throw new NotFoundException(
        'Verification request not found for this user'
      );

    if (data.step === 1) {
      verification.step1Status = data.status;
      verification.step1ReviewedAt = new Date();
      verification.step1ReviewedBy = reviewerId;
    } else if (data.step === 2) {
      if (verification.step2Status === null) {
        throw new BadRequestException(
          'Step 2 is not applicable for this user or was not initialized'
        );
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

  private async syncVerifiedStatus(
    userId: string,
    verification: UserVerificationEntity
  ) {
    const roommate = await this.roommateRepository.findByUserId(userId);
    const agent = await this.agentRepository.findByUserId(userId);

    if (roommate) {
      // Roommate condition: Step 1 Approved
      const isVerified =
        verification.step1Status === VerificationStepStatus.APPROVED;
      if (roommate.isVerified !== isVerified) {
        roommate.isVerified = isVerified;
        await this.roommateRepository.update(roommate);
      }
    }

    if (agent) {
      // Agent condition: Step 1 AND Step 2 Approved
      const step1Approved =
        verification.step1Status === VerificationStepStatus.APPROVED;
      const step2Approved =
        verification.step2Status === VerificationStepStatus.APPROVED;
      const isVerified = step1Approved && step2Approved;

      if (agent.isVerified !== isVerified) {
        agent.isVerified = isVerified;
        await this.agentRepository.update(agent);
        
        if (isVerified) {
          await this.createNotificationUseCase.execute({
            userId,
            type: NotificationType.ACCOUNT_VERIFIED,
            title: 'Conta Verificada',
            message: 'Parabéns! A sua conta foi verificada com sucesso. O seu selo de agente já está visível.',
            link: '/perfil'
          });
        }
      }
    }
  }
}

@Injectable()
export class GetMyVerificationUseCase implements UseCase<
  string,
  UserVerificationEntity | null
> {
  constructor(private readonly repository: IUserVerificationRepository) {}

  async execute(userId: string): Promise<UserVerificationEntity | null> {
    return this.repository.findByUserId(userId);
  }
}
