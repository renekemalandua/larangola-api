import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/db-conection/prisma.service';
import { IPaymentRepository } from '../IPaymentRepository';
import { PaymentEntity, PaymentStatus, PaymentType } from '../../entities/payment.entity';
import { IdValueObject } from '../../shared';

@Injectable()
export class PaymentPrismaRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(record: any): PaymentEntity {
    return PaymentEntity.create(
      {
        userId: record.userId,
        type: record.type as PaymentType,
        amount: record.amount,
        status: record.status as PaymentStatus,
        reference: record.reference,
        method: record.method,
        proofImageUrl: record.proofImageUrl,
        rejectionReason: record.rejectionReason,
        verifiedBy: record.verifiedBy,
        relatedId: record.relatedId,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        user: record.user,
      },
      new IdValueObject(record.id)
    );
  }

  async create(data: PaymentEntity): Promise<PaymentEntity> {
    const record = await this.prisma.payment.create({
      data: {
        id: data.id,
        userId: data.userId,
        type: data.type,
        amount: data.amount,
        status: data.status,
        reference: data.reference,
        method: data.method,
        proofImageUrl: data.proofImageUrl,
        rejectionReason: data.rejectionReason,
        verifiedBy: data.verifiedBy,
        relatedId: data.relatedId,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });
    return this.toDomain(record);
  }

  async update(data: PaymentEntity): Promise<PaymentEntity> {
    const record = await this.prisma.payment.update({
      where: { id: data.id },
      data: {
        status: data.status,
        proofImageUrl: data.proofImageUrl,
        rejectionReason: data.rejectionReason,
        verifiedBy: data.verifiedBy,
        updatedAt: data.updatedAt,
      },
    });
    return this.toDomain(record);
  }

  async findById(id: string): Promise<PaymentEntity | null> {
    const record = await this.prisma.payment.findUnique({
      where: { id },
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  async findByReference(reference: string): Promise<PaymentEntity | null> {
    const record = await this.prisma.payment.findFirst({
      where: { reference },
    });
    if (!record) return null;
    return this.toDomain(record);
  }

  async listByUser(userId: string): Promise<PaymentEntity[]> {
    const records = await this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((record) => this.toDomain(record));
  }

  async listPayments(status?: string): Promise<PaymentEntity[]> {
    const where = status ? { status: status as PaymentStatus } : {};
    const records = await this.prisma.payment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    return records.map((record) => this.toDomain(record));
  }

  async listPending(): Promise<PaymentEntity[]> {
    const records = await this.prisma.payment.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
    return records.map((record) => this.toDomain(record));
  }

  async countPending(): Promise<number> {
    return this.prisma.payment.count({
      where: { status: 'pending' },
    });
  }
}
