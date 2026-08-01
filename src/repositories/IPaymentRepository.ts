import { PaymentEntity } from '../entities/payment.entity';

export abstract class IPaymentRepository {
  abstract create(data: PaymentEntity): Promise<PaymentEntity>;
  abstract update(data: PaymentEntity): Promise<PaymentEntity>;
  abstract findById(id: string): Promise<PaymentEntity | null>;
  abstract findByReference(reference: string): Promise<PaymentEntity | null>;
  abstract listByUser(userId: string): Promise<PaymentEntity[]>;
  abstract listPayments(status?: string): Promise<PaymentEntity[]>;
  abstract listPending(): Promise<PaymentEntity[]>;
  abstract countPending(): Promise<number>;
}
