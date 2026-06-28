import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { PrismaService } from '../shared/db-conection/prisma.service';
import { IAgentRepository } from '../repositories/IAgentRepository';

export interface AgentDashboardStatsResponse {
  planTier: number;
  activeProperties: number;
  totalLeads: number;
  pendingVisits: number;
  recentLeads: any[];
}

@Injectable()
export class GetAgentDashboardStatsUseCase implements UseCase<string, AgentDashboardStatsResponse> {
  constructor(
    private readonly prisma: PrismaService,
    private readonly agentRepository: IAgentRepository
  ) {}

  async execute(agentId: string): Promise<AgentDashboardStatsResponse> {
    const agent = await this.agentRepository.findById(agentId);
    if (!agent) {
      throw new BadRequestException('Agent not found');
    }

    // Determine plan tier
    const planName = agent.activePlan?.name?.toLowerCase() || 'gratuito';
    let planTier = 1; // Basic/Gratuito
    if (planName.includes('pro') || planName.includes('profissional')) planTier = 2;
    if (planName.includes('premium')) planTier = 3;
    if (planName.includes('enterprise') || planName.includes('top')) planTier = 4;

    // Common Stats (Tier 1+)
    const activeProperties = await this.prisma.property.count({
      where: { agentId, status: 'published' }
    });

    const totalLeads = await this.prisma.propertyInterest.count({
      where: { property: { agentId } }
    });

    const pendingVisits = await this.prisma.scheduledVisit.count({
      where: { property: { agentId }, status: 'pending' }
    });

    const recentLeadsRaw = await this.prisma.propertyInterest.findMany({
      where: { property: { agentId } },
      orderBy: { createdAt: 'desc' },
      take: 3,
      include: { user: true, property: true }
    });

    const recentLeads = recentLeadsRaw.map((lead: any) => ({
      id: lead.id,
      clientName: lead.user?.name || 'Cliente Desconhecido',
      clientAvatar: lead.user?.avatar,
      propertyTitle: lead.property?.title || 'Imóvel Desconhecido',
      createdAt: lead.createdAt
    }));

    const response: AgentDashboardStatsResponse = {
      planTier,
      activeProperties,
      totalLeads,
      pendingVisits,
      recentLeads,
    };

    // Advanced filtering (Tier 2/3/4) can be added here later
    // e.g. if (planTier < 2) return response; 
    // else { fetch and append funnel data }

    return response;
  }
}
