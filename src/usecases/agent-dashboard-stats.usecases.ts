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
  // PRO metrics
  portfolioValue?: number;
  leadsGrowth?: number;
  realizedVisits?: number;
  responseRate?: number;
  averageResponseTime?: string;
  topProperties?: any[];
  performanceHistory?: any[];
  // PREMIUM metrics
  premiumInsights?: { message: string, title?: string } | null;
  potentialCommission?: number;
  premiumRoi?: number;
  urgentFollowUps?: number;
  funnel?: { name: string, value: number }[];
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

    let portfolioValue = 0;
    let leadsGrowth = 0;
    let realizedVisits = 0;
    let responseRate = agent.responseRate || 0;
    let averageResponseTime = agent.averageResponseTime || 'N/A';
    let topProperties: any[] = [];
    let performanceHistory: any[] = [];

    if (planTier >= 2) {
      // 1. Portfolio Value
      const portfolioAgg = await this.prisma.property.aggregate({
        _sum: { price: true },
        where: { agentId, status: 'published' }
      });
      portfolioValue = portfolioAgg._sum.price || 0;

      // 2. Leads Growth
      const now = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(now.getDate() - 60);

      const leadsLast30Days = await this.prisma.propertyInterest.count({
        where: { property: { agentId }, createdAt: { gte: thirtyDaysAgo } }
      });
      const leadsPrev30Days = await this.prisma.propertyInterest.count({
        where: { property: { agentId }, createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } }
      });
      
      if (leadsPrev30Days === 0) {
        leadsGrowth = leadsLast30Days > 0 ? 100 : 0;
      } else {
        leadsGrowth = Math.round(((leadsLast30Days - leadsPrev30Days) / leadsPrev30Days) * 100);
      }

      // 3. Realized Visits (this month)
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      realizedVisits = await this.prisma.scheduledVisit.count({
        where: {
          property: { agentId },
          status: 'completed',
          scheduledDate: { gte: firstDayOfMonth }
        }
      });

      // 4. Top 3 Properties by Leads
      const topPropsRaw = await this.prisma.property.findMany({
        where: { agentId },
        include: {
          _count: { select: { propertyInterests: true } }
        },
        orderBy: { propertyInterests: { _count: 'desc' } },
        take: 3
      });

      topProperties = topPropsRaw.map((p, index) => ({
        id: p.id,
        title: p.title,
        price: p.price ? `${p.price.toLocaleString('pt-AO')} Kz` : `Sob consulta`,
        leads: p._count.propertyInterests,
        views: 0
      }));

      // 5. Performance History (Last 7 days Leads vs Closed Deals)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 6);
      sevenDaysAgo.setHours(0,0,0,0);

      const recentLeadsList = await this.prisma.propertyInterest.findMany({
        where: { property: { agentId }, createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true }
      });

      const recentDealsList = await this.prisma.closedDeal.findMany({
        where: { agentId, createdAt: { gte: sevenDaysAgo } },
        select: { createdAt: true }
      });

      const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const historyMap = new Map();
      
      for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(d.getDate() + i);
        const dayStr = d.toISOString().split('T')[0];
        historyMap.set(dayStr, {
          day: days[d.getDay()],
          leads: 0,
          deals: 0
        });
      }

      recentLeadsList.forEach(l => {
        const dayStr = l.createdAt.toISOString().split('T')[0];
        if (historyMap.has(dayStr)) {
          historyMap.get(dayStr).leads++;
        }
      });

      recentDealsList.forEach(d => {
        const dayStr = d.createdAt.toISOString().split('T')[0];
        if (historyMap.has(dayStr)) {
          historyMap.get(dayStr).deals++;
        }
      });

      performanceHistory = Array.from(historyMap.values());
    }

    // ==========================================
    // TIER 3+ (PREMIUM / ENTERPRISE)
    // ==========================================
    let premiumInsights: { title?: string; message: string } | null = null;
    let potentialCommission = 0;
    let premiumRoi = 0;
    let urgentFollowUps = 0;
    let funnel: any[] = [];

    if (planTier >= 3) {
      // 1. Funnel Mapping
      const totalVisits = await this.prisma.scheduledVisit.count({
        where: { property: { agentId } }
      });
      const closedDeals = await this.prisma.closedDeal.findMany({
        where: { agentId }
      });
      
      funnel = [
        { name: 'Anúncios Ativos', value: activeProperties },
        { name: 'Contactos (Leads)', value: totalLeads },
        { name: 'Visitas Agendadas', value: totalVisits },
        { name: 'Negócios Fechados', value: closedDeals.length }
      ];

      // 2. Potential Commission based on historical average
      let avgCommissionRate = 0.05; // Base 5%
      if (closedDeals.length > 0) {
        const sumRates = closedDeals.reduce((acc, deal) => acc + (deal.commissionRate || 0), 0);
        avgCommissionRate = (sumRates / closedDeals.length) / 100;
      }

      const propertiesWithLeads = await this.prisma.property.findMany({
        where: { 
          agentId, 
          status: 'published',
          OR: [
            { propertyInterests: { some: {} } },
            { scheduledVisits: { some: { status: 'pending' } } }
          ]
        }
      });
      const totalPotentialValue = propertiesWithLeads.reduce((acc, p) => acc + (p.price || 0), 0);
      potentialCommission = totalPotentialValue * avgCommissionRate;

      // 3. Premium ROI
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentDeals = closedDeals.filter(d => d.closedDate >= thirtyDaysAgo);
      const totalCommissionsEarned = recentDeals.reduce((acc, d) => acc + (d.commissionAmount || 0), 0);

      const activeSub = await this.prisma.agentSubscription.findFirst({
        where: { agentId, status: 'active' },
        include: { plan: true }
      });
      const planPrice = activeSub?.plan?.price || 0;
      if (planPrice > 0) {
        premiumRoi = Math.round((totalCommissionsEarned / planPrice) * 100);
      } else {
        premiumRoi = totalCommissionsEarned > 0 ? 999 : 0;
      }

      // 4. Urgent Follow Ups (Chats with unread messages > 24h)
      urgentFollowUps = await this.prisma.chat.count({
        where: {
          OR: [
            { user1Id: agent.userId, unreadCountUser1: { gt: 0 } },
            { user2Id: agent.userId, unreadCountUser2: { gt: 0 } }
          ],
          lastMessageTime: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        }
      });

      // 5. AI Insights (Average Price Comparison)
      if (activeProperties > 0) {
        const topProp = await this.prisma.property.findFirst({
          where: { agentId, status: 'published', price: { not: null } },
          orderBy: { price: 'desc' }
        });
        
        if (topProp && topProp.city && topProp.propertyType) {
          const agg = await this.prisma.property.aggregate({
            _avg: { price: true },
            where: { city: topProp.city, propertyType: topProp.propertyType, status: 'published' }
          });
          const avgMarket = agg._avg.price || 0;
          
          if (avgMarket > 0 && topProp.price && topProp.price > avgMarket) {
            const percentage = Math.round(((topProp.price - avgMarket) / avgMarket) * 100);
            premiumInsights = {
              title: "LarAngola AI Insights",
              message: `Analisamos o mercado hoje. O seu imóvel "${topProp.title}" está ${percentage}% acima da média na sua região. Ajustar o preço de forma estratégica pode aumentar os seus leads em até 3x.`
            };
          } else {
            premiumInsights = {
              title: "LarAngola AI Insights",
              message: `O seu portfólio está com preços altamente competitivos para o mercado atual em ${topProp.city}. Continue o excelente trabalho de angariação!`
            };
          }
        }
      }
    }

    const response: AgentDashboardStatsResponse = {
      planTier,
      activeProperties,
      totalLeads,
      pendingVisits,
      recentLeads,
      ...(planTier >= 2 && {
        portfolioValue,
        leadsGrowth,
        realizedVisits,
        responseRate,
        averageResponseTime,
        topProperties,
        performanceHistory
      }),
      ...(planTier >= 3 && {
        premiumInsights,
        potentialCommission,
        premiumRoi,
        urgentFollowUps,
        funnel
      })
    };

    return response;
  }
}
