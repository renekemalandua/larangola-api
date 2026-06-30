import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { ClosedDealEntity, ClosedDealStatus } from '../entities/closed-deal.entity';
import { IClosedDealRepository } from '../repositories/IClosedDealRepository';
import { IPropertyRepository } from '../repositories/IPropertyRepository';
import { IAgentRepository } from '../repositories/IAgentRepository';

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

    // Update property status
    property.status = 'finished' as any;
    await this.propertyRepository.update(property);

    // Get today's deals to calculate rate
    const agentDeals = await this.closedDealRepository.listByAgent(agent.id);
    const today = new Date().toISOString().split('T')[0];
    const dealsToday = agentDeals.filter(d => d.closedDate.toISOString().startsWith(today)).length;

    // Base rules for rate
    let commissionRate = 0;
    // Assuming agent entity has access to user role or we just default
    // We will just store the amount. The rate is cosmetic for the stat dashboard.
    // If we want exact rate, we can compute it if property.price > 0.
    if (property.price && property.price > 0) {
      commissionRate = (request.commissionAmount / property.price) * 100;
    }

    const closedDeal = ClosedDealEntity.create({
      propertyId: property.id,
      agentId: agent.id,
      commissionAmount: request.commissionAmount,
      commissionRate: commissionRate,
      status: ClosedDealStatus.completed,
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

    // Assume rate calculation logic based on current performance (could be dynamic)
    const commissionRate = dealsToday >= 2 ? 2 : 0; // Simplified logic as requested by UI

    return {
      totalCommission,
      monthlyCommission,
      dealsThisMonth,
      dealsToday,
      commissionRate
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
    
    // We need property details to show the address
    const history: any[] = [];
    for (const deal of deals) {
      const property = await this.propertyRepository.findById(deal.propertyId);
      history.push({
        id: deal.id,
        propertyAddress: property ? property.title : 'Imóvel Excluído',
        clientName: 'Negócio Direto', // Or fetch from client if it exists
        amount: deal.commissionAmount,
        date: deal.closedDate.toISOString(),
      });
    }

    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
}
