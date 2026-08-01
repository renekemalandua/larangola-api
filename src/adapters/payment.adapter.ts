import { PaymentEntity } from '../entities/payment.entity';

export class PaymentAdapter {
  static toHttp(entity: PaymentEntity) {
    return {
      id: entity.id,
      userId: entity.userId,
      type: entity.type,
      amount: entity.amount,
      status: entity.status,
      reference: entity.reference,
      method: entity.method,
      proofImageUrl: entity.proofImageUrl,
      rejectionReason: entity.rejectionReason,
      verifiedBy: entity.verifiedBy,
      relatedId: entity.relatedId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      user: entity.user,
    };
  }
}
