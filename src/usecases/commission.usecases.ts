import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UseCase } from '../shared';
import {
  ClosedDealEntity,
  ClosedDealStatus,
  DealStage,
  PlatformFeeStatus,
  AgentBankAccountEntity,
} from '../entities/closed-deal.entity';
import {
  IClosedDealRepository,
  IAgentBankAccountRepository,
} from '../repositories/IClosedDealRepository';
import { IPropertyRepository } from '../repositories/IPropertyRepository';
import { IAgentRepository } from '../repositories/IAgentRepository';
import { IUserRepository } from '../repositories/IUserRepository';

// ----------------------------------------------------
// PIPELINE TRANSITIONS
// ----------------------------------------------------

export interface AdvanceDealStageRequest {
  dealId?: string;
  propertyId: string;
  clientId: string;
  userId: string; // Authenticated user
  stage: DealStage;
  dealAmount?: number;
  dealType?: string;
}

@Injectable()
export class AdvanceDealStageUseCase {
  constructor(
    private readonly closedDealRepository: IClosedDealRepository,
    private readonly propertyRepository: IPropertyRepository,
    private readonly agentRepository: IAgentRepository
  ) {}

  async execute(request: AdvanceDealStageRequest): Promise<ClosedDealEntity> {
    const property = await this.propertyRepository.findById(request.propertyId);
    if (!property) throw new BadRequestException('Imóvel não encontrado');

    let deal: ClosedDealEntity | null = null;
    if (request.dealId) {
      deal = await this.closedDealRepository.findById(request.dealId);
    } else {
      deal = await this.closedDealRepository.findByPropertyAndClient(
        request.propertyId,
        request.clientId
      );
    }

    if (!deal) {
      // Create new deal in pipeline
      deal = ClosedDealEntity.create({
        propertyId: property.id,
        agentId: property.agentId,
        clientId: request.clientId,
        dealType: request.dealType || property.listingType,
        dealAmount: request.dealAmount || property.price || 0,
        commissionAmount: 0,
        commissionRate: 0,
        status: ClosedDealStatus.pending_payment,
        stage: request.stage,
        platformFeeRate: 20.0,
        platformFeeAmount: (request.dealAmount || property.price || 0) * 0.2,
        platformFeeStatus: PlatformFeeStatus.PENDING,
        closedDate: new Date(),
      });
      return this.closedDealRepository.create(deal);
    }

    deal.stage = request.stage;
    if (request.dealAmount) {
      deal.dealAmount = request.dealAmount;
    }
    if (request.dealType) {
      deal.dealType = request.dealType;
    }
    return this.closedDealRepository.update(deal);
  }
}

export interface SendBankDetailsRequest {
  dealId: string;
  userId: string; // Agent user
  bankName: string;
  iban: string;
  accountHolder: string;
  isOwnerAccount?: boolean;
}

@Injectable()
export class SendBankDetailsUseCase {
  constructor(
    private readonly closedDealRepository: IClosedDealRepository,
    private readonly agentRepository: IAgentRepository,
    private readonly propertyRepository: IPropertyRepository
  ) {}

  async execute(request: SendBankDetailsRequest): Promise<ClosedDealEntity> {
    const agent = await this.agentRepository.findByUserId(request.userId);
    if (!agent) throw new BadRequestException('Agente não encontrado');

    const deal = await this.closedDealRepository.findById(request.dealId);
    if (!deal) throw new NotFoundException('Negócio não encontrado');

    if (deal.agentId !== agent.id) {
      throw new BadRequestException('Apenas o agente responsável pode enviar as coordenadas bancárias');
    }

    // Check if property is from Bolsa LarAngola
    const property = await this.propertyRepository.findById(deal.propertyId);
    // If property was submitted by owner or flagged as Bolsa
    if (property && (property as any).source === 'owner_submission' && !request.isOwnerAccount) {
      throw new BadRequestException('Para imóveis da Bolsa LarAngola, as coordenadas bancárias devem ser obrigatoriamente do proprietário');
    }

    deal.paymentBankName = request.bankName;
    deal.paymentIban = request.iban;
    deal.paymentAccountHolder = request.accountHolder;
    deal.isOwnerAccount = !!request.isOwnerAccount;
    deal.stage = DealStage.WAITING_PAYMENT;

    return this.closedDealRepository.update(deal);
  }
}

export interface ClientSubmitReceiptRequest {
  dealId: string;
  userId: string; // Client user
  receiptUrl: string;
  note?: string;
}

@Injectable()
export class ClientSubmitReceiptUseCase {
  constructor(private readonly closedDealRepository: IClosedDealRepository) {}

  async execute(request: ClientSubmitReceiptRequest): Promise<ClosedDealEntity> {
    const deal = await this.closedDealRepository.findById(request.dealId);
    if (!deal) throw new NotFoundException('Negócio não encontrado');

    if (deal.clientId && deal.clientId !== request.userId) {
      throw new BadRequestException('Apenas o cliente do negócio pode submeter o comprovativo');
    }

    deal.clientPaymentReceiptUrl = request.receiptUrl;
    deal.clientPaymentReceiptNote = request.note || null;
    deal.clientPaidAt = new Date();
    deal.stage = DealStage.PAYMENT_SUBMITTED;

    return this.closedDealRepository.update(deal);
  }
}

export interface AgentConfirmDealRequest {
  dealId: string;
  userId: string; // Agent user
  commissionAmount?: number;
}

@Injectable()
export class AgentConfirmDealUseCase {
  constructor(
    private readonly closedDealRepository: IClosedDealRepository,
    private readonly agentRepository: IAgentRepository,
    private readonly propertyRepository: IPropertyRepository
  ) {}

  async execute(request: AgentConfirmDealRequest): Promise<ClosedDealEntity> {
    const agent = await this.agentRepository.findByUserId(request.userId);
    if (!agent) throw new BadRequestException('Agente não encontrado');

    const deal = await this.closedDealRepository.findById(request.dealId);
    if (!deal) throw new NotFoundException('Negócio não encontrado');

    if (deal.agentId !== agent.id) {
      throw new BadRequestException('Apenas o agente responsável pode confirmar o negócio');
    }

    deal.stage = DealStage.DEAL_CLOSED;
    deal.status = ClosedDealStatus.completed;
    deal.agentConfirmedAt = new Date();
    deal.closedDate = new Date();

    if (request.commissionAmount !== undefined && request.commissionAmount >= 0) {
      deal.commissionAmount = Number(request.commissionAmount);
      if (deal.dealAmount && deal.dealAmount > 0) {
        deal.commissionRate = Number(((deal.commissionAmount / deal.dealAmount) * 100).toFixed(2));
      }
    }

    // Calculate Platform fee (20%)
    const agreedAmount = deal.dealAmount || 0;
    deal.platformFeeRate = 20.0;
    deal.platformFeeAmount = agreedAmount * 0.2;
    deal.platformFeeStatus = PlatformFeeStatus.PENDING;

    // Mark property as finished
    const property = await this.propertyRepository.findById(deal.propertyId);
    if (property) {
      property.status = 'finished' as any;
      await this.propertyRepository.update(property);
    }

    return this.closedDealRepository.update(deal);
  }
}

export interface AgentSubmitFeeReceiptRequest {
  dealId: string;
  userId: string; // Agent user
  receiptUrl: string;
}

@Injectable()
export class AgentSubmitFeeReceiptUseCase {
  constructor(
    private readonly closedDealRepository: IClosedDealRepository,
    private readonly agentRepository: IAgentRepository
  ) {}

  async execute(request: AgentSubmitFeeReceiptRequest): Promise<ClosedDealEntity> {
    const agent = await this.agentRepository.findByUserId(request.userId);
    if (!agent) throw new BadRequestException('Agente não encontrado');

    const deal = await this.closedDealRepository.findById(request.dealId);
    if (!deal) throw new NotFoundException('Negócio não encontrado');

    if (deal.agentId !== agent.id) {
      throw new BadRequestException('Apenas o agente responsável pode submeter o comprovativo da taxa');
    }

    deal.agentFeeReceiptUrl = request.receiptUrl;
    deal.agentFeeSubmittedAt = new Date();
    deal.platformFeeStatus = PlatformFeeStatus.SUBMITTED;

    return this.closedDealRepository.update(deal);
  }
}

export interface AdminReviewFeeRequest {
  dealId: string;
  adminUserId: string;
  approved: boolean;
  rejectionReason?: string;
}

@Injectable()
export class AdminReviewFeeUseCase {
  constructor(private readonly closedDealRepository: IClosedDealRepository) {}

  async execute(request: AdminReviewFeeRequest): Promise<ClosedDealEntity> {
    const deal = await this.closedDealRepository.findById(request.dealId);
    if (!deal) throw new NotFoundException('Negócio não encontrado');

    deal.adminReviewedAt = new Date();
    deal.adminReviewedBy = request.adminUserId;
    if (request.approved) {
      deal.platformFeeStatus = PlatformFeeStatus.APPROVED;
      deal.adminRejectionReason = null;
    } else {
      deal.platformFeeStatus = PlatformFeeStatus.REJECTED;
      deal.adminRejectionReason = request.rejectionReason || 'Comprovativo inválido ou valor não correspondente.';
    }

    return this.closedDealRepository.update(deal);
  }
}

// ----------------------------------------------------
// AGENT BANK ACCOUNTS USE CASES
// ----------------------------------------------------

export interface CreateBankAccountRequest {
  userId: string;
  bankName: string;
  iban: string;
  accountHolder: string;
  isFavorite?: boolean;
}

@Injectable()
export class CreateAgentBankAccountUseCase {
  constructor(
    private readonly bankAccountRepo: IAgentBankAccountRepository,
    private readonly agentRepo: IAgentRepository
  ) {}

  async execute(request: CreateBankAccountRequest): Promise<AgentBankAccountEntity> {
    const agent = await this.agentRepo.findByUserId(request.userId);
    if (!agent) throw new BadRequestException('Perfil de agente não encontrado');

    const entity = AgentBankAccountEntity.create({
      agentId: agent.id,
      bankName: request.bankName,
      iban: request.iban,
      accountHolder: request.accountHolder,
      isFavorite: !!request.isFavorite,
    });
    return this.bankAccountRepo.create(entity);
  }
}

@Injectable()
export class ListAgentBankAccountsUseCase {
  constructor(
    private readonly bankAccountRepo: IAgentBankAccountRepository,
    private readonly agentRepo: IAgentRepository
  ) {}

  async execute(userId: string): Promise<AgentBankAccountEntity[]> {
    const agent = await this.agentRepo.findByUserId(userId);
    if (!agent) throw new BadRequestException('Perfil de agente não encontrado');

    return this.bankAccountRepo.listByAgent(agent.id);
  }
}

@Injectable()
export class SetFavoriteBankAccountUseCase {
  constructor(
    private readonly bankAccountRepo: IAgentBankAccountRepository,
    private readonly agentRepo: IAgentRepository
  ) {}

  async execute(userId: string, accountId: string): Promise<AgentBankAccountEntity> {
    const agent = await this.agentRepo.findByUserId(userId);
    if (!agent) throw new BadRequestException('Perfil de agente não encontrado');

    return this.bankAccountRepo.setFavorite(agent.id, accountId);
  }
}

@Injectable()
export class DeleteAgentBankAccountUseCase {
  constructor(
    private readonly bankAccountRepo: IAgentBankAccountRepository,
    private readonly agentRepo: IAgentRepository
  ) {}

  async execute(userId: string, accountId: string): Promise<void> {
    const agent = await this.agentRepo.findByUserId(userId);
    if (!agent) throw new BadRequestException('Perfil de agente não encontrado');

    const account = await this.bankAccountRepo.findById(accountId);
    if (!account) throw new NotFoundException('Conta bancária não encontrada');

    if (account.agentId !== agent.id) {
      throw new BadRequestException('Sem permissão para apagar esta conta bancária');
    }

    return this.bankAccountRepo.delete(accountId);
  }
}

// ----------------------------------------------------
// EXISTING COMMISSION / STATS USE CASES
// ----------------------------------------------------

export interface CloseDealRequest {
  propertyId: string;
  userId: string;
  commissionAmount: number;
}

@Injectable()
export class CloseDealAndCalculateCommissionUseCase implements UseCase<CloseDealRequest, ClosedDealEntity> {
  constructor(
    private readonly closedDealRepository: IClosedDealRepository,
    private readonly propertyRepository: IPropertyRepository,
    private readonly agentRepository: IAgentRepository
  ) {}

  async execute(request: CloseDealRequest): Promise<ClosedDealEntity> {
    const property = await this.propertyRepository.findById(request.propertyId);
    if (!property) throw new BadRequestException('Property does not exist');

    const agent = await this.agentRepository.findByUserId(request.userId);
    if (!agent) throw new BadRequestException('Agent does not exist for this user');

    if (property.agentId !== agent.id) throw new BadRequestException('You do not own this property');

    property.status = 'finished' as any;
    await this.propertyRepository.update(property);

    let commissionRate = 0;
    if (property.price && property.price > 0) {
      commissionRate = (request.commissionAmount / property.price) * 100;
    }

    const closedDeal = ClosedDealEntity.create({
      propertyId: property.id,
      agentId: agent.id,
      commissionAmount: request.commissionAmount,
      commissionRate: commissionRate,
      status: ClosedDealStatus.completed,
      stage: DealStage.DEAL_CLOSED,
      dealAmount: property.price || 0,
      platformFeeRate: 20.0,
      platformFeeAmount: (property.price || 0) * 0.2,
      platformFeeStatus: PlatformFeeStatus.PENDING,
      closedDate: new Date(),
    });

    return this.closedDealRepository.create(closedDeal);
  }
}

export interface CommissionStatsResponse {
  totalCommission: number;
  monthlyCommission: number;
  dealsThisMonth: number;
  dealsToday: number;
  commissionRate: number;
  pendingPlatformFeesAmount: number;
  pendingPlatformFeesCount: number;
}

@Injectable()
export class GetCommissionStatsUseCase implements UseCase<string, CommissionStatsResponse> {
  constructor(
    private readonly closedDealRepository: IClosedDealRepository,
    private readonly agentRepository: IAgentRepository
  ) {}

  async execute(userId: string): Promise<CommissionStatsResponse> {
    const agent = await this.agentRepository.findByUserId(userId);
    if (!agent) throw new BadRequestException('Agent not found');

    const deals = await this.closedDealRepository.listByAgent(agent.id);
    
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const todayDeals = deals.filter(t => t.closedDate.toISOString().startsWith(today));
    const dealsToday = todayDeals.length;

    const monthlyTransactions = deals.filter(t => {
      const tDate = t.closedDate;
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });
    
    const dealsThisMonth = monthlyTransactions.length;
    const totalCommission = deals.reduce((acc, t) => acc + t.commissionAmount, 0);
    const monthlyCommission = monthlyTransactions.reduce((acc, t) => acc + t.commissionAmount, 0);

    const totalDealVolume = deals.reduce((acc, t) => acc + (t.dealAmount || 0), 0);
    const commissionRate = totalDealVolume > 0 && totalCommission > 0
      ? Number(((totalCommission / totalDealVolume) * 100).toFixed(1))
      : 20;

    // Pending fees calculation
    const pendingDeals = deals.filter(
      (d) => d.stage === DealStage.DEAL_CLOSED && d.platformFeeStatus !== PlatformFeeStatus.APPROVED
    );
    const pendingPlatformFeesAmount = pendingDeals.reduce((acc, d) => acc + (d.platformFeeAmount || 0), 0);
    const pendingPlatformFeesCount = pendingDeals.length;

    return {
      totalCommission,
      monthlyCommission,
      dealsThisMonth,
      dealsToday,
      commissionRate,
      pendingPlatformFeesAmount,
      pendingPlatformFeesCount,
    };
  }
}

@Injectable()
export class GetCommissionHistoryUseCase implements UseCase<string, any[]> {
  constructor(
    private readonly closedDealRepository: IClosedDealRepository,
    private readonly propertyRepository: IPropertyRepository,
    private readonly agentRepository: IAgentRepository
  ) {}

  async execute(userId: string): Promise<any[]> {
    const agent = await this.agentRepository.findByUserId(userId);
    if (!agent) throw new BadRequestException('Agent not found');

    const deals = await this.closedDealRepository.listByAgent(agent.id);
    
    const history: any[] = [];
    for (const deal of deals) {
      const property = await this.propertyRepository.findById(deal.propertyId);
      history.push({
        id: deal.id,
        propertyId: deal.propertyId,
        propertyAddress: property ? property.title : 'Imóvel Excluído',
        clientName: 'Negócio Direto',
        amount: deal.commissionAmount,
        dealAmount: deal.dealAmount,
        stage: deal.stage,
        platformFeeAmount: deal.platformFeeAmount,
        platformFeeStatus: deal.platformFeeStatus,
        date: deal.closedDate.toISOString(),
      });
    }

    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}

@Injectable()
export class ListPendingFeesUseCase {
  constructor(
    private readonly closedDealRepository: IClosedDealRepository,
    private readonly agentRepository: IAgentRepository,
    private readonly propertyRepository: IPropertyRepository
  ) {}

  async execute(userId: string): Promise<any[]> {
    const agent = await this.agentRepository.findByUserId(userId);
    if (!agent) throw new BadRequestException('Agent not found');

    const pendingDeals = await this.closedDealRepository.listPendingFeesByAgent(agent.id);
    const results: any[] = [];

    for (const deal of pendingDeals) {
      const prop = await this.propertyRepository.findById(deal.propertyId);
      results.push({
        id: deal.id,
        propertyId: deal.propertyId,
        propertyTitle: prop?.title || 'Imóvel',
        dealAmount: deal.dealAmount || 0,
        dealType: deal.dealType || 'rent',
        platformFeeRate: deal.platformFeeRate,
        platformFeeAmount: deal.platformFeeAmount,
        platformFeeStatus: deal.platformFeeStatus,
        agentFeeReceiptUrl: deal.agentFeeReceiptUrl,
        agentFeeSubmittedAt: deal.agentFeeSubmittedAt,
        adminRejectionReason: deal.adminRejectionReason,
        closedDate: deal.closedDate,
      });
    }

    return results;
  }
}

@Injectable()
export class GetDealDetailsUseCase {
  constructor(
    private readonly closedDealRepository: IClosedDealRepository,
    private readonly propertyRepository: IPropertyRepository
  ) {}

  async execute(dealId: string): Promise<any> {
    const deal = await this.closedDealRepository.findById(dealId);
    if (!deal) throw new NotFoundException('Negócio não encontrado');

    const property = await this.propertyRepository.findById(deal.propertyId);
    return {
      deal,
      property,
    };
  }
}

@Injectable()
export class AdminListAllDealsUseCase {
  constructor(private readonly closedDealRepository: IClosedDealRepository) {}

  async execute(): Promise<any[]> {
    return this.closedDealRepository.listAllWithDetails();
  }
}

@Injectable()
export class GetDealByPropertyAndClientUseCase {
  constructor(private readonly closedDealRepository: IClosedDealRepository) {}

  async execute(propertyId: string, clientId: string): Promise<ClosedDealEntity | null> {
    return this.closedDealRepository.findByPropertyAndClient(propertyId, clientId);
  }
}



