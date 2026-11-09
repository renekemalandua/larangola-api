import {
  ClosedDeal,
  ClosedDealStatus as ClosedDealStatusPrisma,
  DealStage as DealStagePrisma,
  PlatformFeeStatus as PlatformFeeStatusPrisma,
  AgentBankAccount,
} from '@prisma/client';
import {
  ClosedDealEntity,
  ClosedDealStatus,
  DealStage,
  PlatformFeeStatus,
  AgentBankAccountEntity,
} from '../entities/closed-deal.entity';
import { IdValueObject } from '../shared';

export class ClosedDealAdapter {
  static toDomain(raw: ClosedDeal): ClosedDealEntity {
    return ClosedDealEntity.create(
      {
        propertyId: raw.propertyId,
        agentId: raw.agentId,
        clientId: raw.clientId,
        dealType: raw.dealType,
        dealAmount: raw.dealAmount,
        commissionAmount: raw.commissionAmount,
        commissionRate: raw.commissionRate,
        status: raw.status as ClosedDealStatus,
        stage: raw.stage as DealStage,

        paymentBankName: raw.paymentBankName,
        paymentIban: raw.paymentIban,
        paymentAccountHolder: raw.paymentAccountHolder,
        isOwnerAccount: raw.isOwnerAccount,

        clientPaymentReceiptUrl: raw.clientPaymentReceiptUrl,
        clientPaymentReceiptNote: raw.clientPaymentReceiptNote,
        clientPaidAt: raw.clientPaidAt,
        agentConfirmedAt: raw.agentConfirmedAt,

        platformFeeRate: raw.platformFeeRate,
        platformFeeAmount: raw.platformFeeAmount,
        platformFeeStatus: raw.platformFeeStatus as PlatformFeeStatus,
        agentFeeReceiptUrl: raw.agentFeeReceiptUrl,
        agentFeeSubmittedAt: raw.agentFeeSubmittedAt,
        adminReviewedAt: raw.adminReviewedAt,
        adminReviewedBy: raw.adminReviewedBy,
        adminRejectionReason: raw.adminRejectionReason,

        closedDate: raw.closedDate,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new IdValueObject(raw.id)
    );
  }

  static toPrisma(entity: ClosedDealEntity): ClosedDeal {
    return {
      id: entity.id,
      propertyId: entity.propertyId,
      agentId: entity.agentId,
      clientId: entity.clientId ?? null,
      dealType: entity.dealType ?? null,
      dealAmount: entity.dealAmount ?? null,
      commissionAmount: entity.commissionAmount,
      commissionRate: entity.commissionRate,
      status: entity.status as ClosedDealStatusPrisma,
      stage: entity.stage as DealStagePrisma,

      paymentBankName: entity.paymentBankName ?? null,
      paymentIban: entity.paymentIban ?? null,
      paymentAccountHolder: entity.paymentAccountHolder ?? null,
      isOwnerAccount: entity.isOwnerAccount ?? false,

      clientPaymentReceiptUrl: entity.clientPaymentReceiptUrl ?? null,
      clientPaymentReceiptNote: entity.clientPaymentReceiptNote ?? null,
      clientPaidAt: entity.clientPaidAt ?? null,
      agentConfirmedAt: entity.agentConfirmedAt ?? null,

      platformFeeRate: entity.platformFeeRate,
      platformFeeAmount: entity.platformFeeAmount,
      platformFeeStatus: entity.platformFeeStatus as PlatformFeeStatusPrisma,
      agentFeeReceiptUrl: entity.agentFeeReceiptUrl ?? null,
      agentFeeSubmittedAt: entity.agentFeeSubmittedAt ?? null,
      adminReviewedAt: entity.adminReviewedAt ?? null,
      adminReviewedBy: entity.adminReviewedBy ?? null,
      adminRejectionReason: entity.adminRejectionReason ?? null,

      closedDate: entity.closedDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toHttp(entity: ClosedDealEntity, extraProps?: any): any {
    return {
      id: entity.id,
      propertyId: entity.propertyId,
      agentId: entity.agentId,
      clientId: entity.clientId,
      dealType: entity.dealType,
      dealAmount: entity.dealAmount,
      commissionAmount: entity.commissionAmount,
      commissionRate: entity.commissionRate,
      status: entity.status,
      stage: entity.stage,

      paymentBankName: entity.paymentBankName,
      paymentIban: entity.paymentIban,
      paymentAccountHolder: entity.paymentAccountHolder,
      isOwnerAccount: entity.isOwnerAccount,

      clientPaymentReceiptUrl: entity.clientPaymentReceiptUrl,
      clientPaymentReceiptNote: entity.clientPaymentReceiptNote,
      clientPaidAt: entity.clientPaidAt,
      agentConfirmedAt: entity.agentConfirmedAt,

      platformFeeRate: entity.platformFeeRate,
      platformFeeAmount: entity.platformFeeAmount,
      platformFeeStatus: entity.platformFeeStatus,
      agentFeeReceiptUrl: entity.agentFeeReceiptUrl,
      agentFeeSubmittedAt: entity.agentFeeSubmittedAt,
      adminReviewedAt: entity.adminReviewedAt,
      adminReviewedBy: entity.adminReviewedBy,
      adminRejectionReason: entity.adminRejectionReason,

      closedDate: entity.closedDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      ...extraProps,
    };
  }
}

export class AgentBankAccountAdapter {
  static toDomain(raw: AgentBankAccount): AgentBankAccountEntity {
    return AgentBankAccountEntity.create(
      {
        agentId: raw.agentId,
        bankName: raw.bankName,
        iban: raw.iban,
        accountHolder: raw.accountHolder,
        isFavorite: raw.isFavorite,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new IdValueObject(raw.id)
    );
  }

  static toPrisma(entity: AgentBankAccountEntity): AgentBankAccount {
    return {
      id: entity.id,
      agentId: entity.agentId,
      bankName: entity.bankName,
      iban: entity.iban,
      accountHolder: entity.accountHolder,
      isFavorite: entity.isFavorite,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toHttp(entity: AgentBankAccountEntity): any {
    return {
      id: entity.id,
      agentId: entity.agentId,
      bankName: entity.bankName,
      iban: entity.iban,
      accountHolder: entity.accountHolder,
      isFavorite: entity.isFavorite,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}

