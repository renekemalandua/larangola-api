import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { PaymentEntity, PaymentType } from '../entities/payment.entity';
import { IPaymentRepository } from '../repositories/IPaymentRepository';
import { IAgentPlanRepository } from '../repositories/IAgentPlanRepository';
import { IUploadService } from '../shared/services/IUploadService';

@Injectable()
export class CreateSubscriptionPaymentUseCase
  implements UseCase<{ userId: string; planId: string }, PaymentEntity>
{
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly planRepository: IAgentPlanRepository
  ) {}

  async execute({
    userId,
    planId,
  }: {
    userId: string;
    planId: string;
  }): Promise<PaymentEntity> {
    const plan = await this.planRepository.findById(planId);
    if (!plan) throw new BadRequestException('Agent plan does not exist');

    // Generate reference LAR-YYYY-XXXX
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    const reference = `LAR-${year}-${random}`;

    const entity = PaymentEntity.create({
      userId,
      type: PaymentType.subscription,
      amount: plan.price,
      reference,
      method: 'manual',
      relatedId: planId, // Storing planId to activate subscription later
    });

    return this.paymentRepository.create(entity);
  }
}

@Injectable()
export class UploadPaymentProofUseCase
  implements UseCase<{ userId: string; paymentId: string; file: Express.Multer.File }, PaymentEntity>
{
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly uploadService: IUploadService
  ) {}

  async execute({
    userId,
    paymentId,
    file,
  }: {
    userId: string;
    paymentId: string;
    file: Express.Multer.File;
  }): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) throw new BadRequestException('Payment not found');
    if (payment.userId !== userId) throw new BadRequestException('Unauthorized');
    if (payment.status !== 'pending') throw new BadRequestException('Payment is not pending');

    const imageUrl = await this.uploadService.uploadImage('payments', file);
    payment.proofImageUrl = imageUrl;

    return this.paymentRepository.update(payment);
  }
}

@Injectable()
export class ListMyPaymentsUseCase implements UseCase<string, PaymentEntity[]> {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(userId: string): Promise<PaymentEntity[]> {
    return this.paymentRepository.listByUser(userId);
  }
}
