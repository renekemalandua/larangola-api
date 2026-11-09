import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IClosedDealRepository, IAgentBankAccountRepository } from '../IClosedDealRepository';
import { ClosedDealEntity, AgentBankAccountEntity } from '../../entities/closed-deal.entity';
import { ClosedDealAdapter, AgentBankAccountAdapter } from '../../adapters/closed-deal.adapter';

@Injectable()
export class PrismaClosedDealRepository implements IClosedDealRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ClosedDealEntity): Promise<ClosedDealEntity> {
    const raw = ClosedDealAdapter.toPrisma(data) as any;
    const created = await this.prisma.closedDeal.create({ data: raw });
    return ClosedDealAdapter.toDomain(created);
  }

  async list(): Promise<ClosedDealEntity[]> {
    const rows = await this.prisma.closedDeal.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(ClosedDealAdapter.toDomain);
  }

  async listByAgent(agentId: string): Promise<ClosedDealEntity[]> {
    const rows = await this.prisma.closedDeal.findMany({
      where: { agentId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(ClosedDealAdapter.toDomain);
  }

  async listByClient(clientId: string): Promise<ClosedDealEntity[]> {
    const rows = await this.prisma.closedDeal.findMany({
      where: { clientId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(ClosedDealAdapter.toDomain);
  }

  async listByProperty(propertyId: string): Promise<ClosedDealEntity[]> {
    const rows = await this.prisma.closedDeal.findMany({
      where: { propertyId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(ClosedDealAdapter.toDomain);
  }

  async findById(id: string): Promise<ClosedDealEntity | null> {
    const row = await this.prisma.closedDeal.findUnique({ where: { id } });
    return row ? ClosedDealAdapter.toDomain(row) : null;
  }

  async findByPropertyAndClient(propertyId: string, clientId: string): Promise<ClosedDealEntity | null> {
    const row = await this.prisma.closedDeal.findFirst({
      where: {
        propertyId,
        clientId,
      },
      orderBy: { createdAt: 'desc' },
    });
    return row ? ClosedDealAdapter.toDomain(row) : null;
  }

  async listPendingFeesByAgent(agentId: string): Promise<ClosedDealEntity[]> {
    const rows = await this.prisma.closedDeal.findMany({
      where: {
        agentId,
        stage: 'DEAL_CLOSED',
        platformFeeStatus: {
          in: ['PENDING', 'SUBMITTED', 'REJECTED'],
        },
      },
      orderBy: { closedDate: 'desc' },
    });
    return rows.map(ClosedDealAdapter.toDomain);
  }

  async listAllWithDetails(): Promise<any[]> {
    const rows = await this.prisma.closedDeal.findMany({
      include: {
        property: true,
        agent: {
          include: {
            user: true,
          },
        },
        client: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((r) => ({
      ...ClosedDealAdapter.toHttp(ClosedDealAdapter.toDomain(r)),
      property: r.property,
      agent: r.agent,
      client: r.client,
    }));
  }

  async update(data: ClosedDealEntity): Promise<ClosedDealEntity> {
    const exists = await this.prisma.closedDeal.findUnique({
      where: { id: data.id },
    });
    if (!exists) throw new NotFoundException('Closed deal not found');
    const raw = ClosedDealAdapter.toPrisma(data) as any;
    const updated = await this.prisma.closedDeal.update({
      where: { id: data.id },
      data: raw,
    });
    return ClosedDealAdapter.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.closedDeal.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Closed deal not found');
    await this.prisma.closedDeal.delete({ where: { id } });
  }
}

@Injectable()
export class PrismaAgentBankAccountRepository implements IAgentBankAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: AgentBankAccountEntity): Promise<AgentBankAccountEntity> {
    const raw = AgentBankAccountAdapter.toPrisma(data) as any;
    // If set as favorite, unmark existing favorites first
    if (raw.isFavorite) {
      await this.prisma.agentBankAccount.updateMany({
        where: { agentId: raw.agentId, isFavorite: true },
        data: { isFavorite: false },
      });
    }
    const created = await this.prisma.agentBankAccount.create({ data: raw });
    return AgentBankAccountAdapter.toDomain(created);
  }

  async listByAgent(agentId: string): Promise<AgentBankAccountEntity[]> {
    const rows = await this.prisma.agentBankAccount.findMany({
      where: { agentId },
      orderBy: [
        { isFavorite: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    return rows.map(AgentBankAccountAdapter.toDomain);
  }

  async findById(id: string): Promise<AgentBankAccountEntity | null> {
    const row = await this.prisma.agentBankAccount.findUnique({ where: { id } });
    return row ? AgentBankAccountAdapter.toDomain(row) : null;
  }

  async setFavorite(agentId: string, accountId: string): Promise<AgentBankAccountEntity> {
    const target = await this.prisma.agentBankAccount.findFirst({
      where: { id: accountId, agentId },
    });
    if (!target) throw new NotFoundException('Conta bancária não encontrada');

    await this.prisma.agentBankAccount.updateMany({
      where: { agentId, isFavorite: true },
      data: { isFavorite: false },
    });

    const updated = await this.prisma.agentBankAccount.update({
      where: { id: accountId },
      data: { isFavorite: true },
    });
    return AgentBankAccountAdapter.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.agentBankAccount.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Conta bancária não encontrada');
    await this.prisma.agentBankAccount.delete({ where: { id } });
  }
}

