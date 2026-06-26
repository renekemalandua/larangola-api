import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IAgentRepository } from '../IAgentRepository';
import { AgentEntity } from '../../entities/agent.entity';
import { AgentAdapter } from '../../adapters/agent.adapter';

@Injectable()
export class PrismaAgentRepository implements IAgentRepository {
  constructor(private readonly prisma: PrismaService) {}

  private async enrichAgentRow(row: any): Promise<AgentEntity> {
    const propertiesCount = await this.prisma.property.count({
      where: { agentId: row.id }
    });
    
    const reviews = await this.prisma.review.findMany({
      where: { toUserId: row.userId, role: 'AGENT' },
      select: { rating: true }
    });
    
    const reviewCount = reviews.length;
    const averageRating = reviewCount > 0 
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
      : 5.0;
    const activeSub = row.subscriptions?.find((s: any) => s.status === 'active');
    if (activeSub && activeSub.plan) {
      row.activePlan = activeSub.plan;
    }
      
    const entity = AgentAdapter.toDomain(row);
    entity.propertiesCount = propertiesCount;
    entity.averageRating = averageRating;
    (entity as any).reviewCount = reviewCount;
    (entity as any).user = row.user;
    return entity;
  }

  async create(data: AgentEntity): Promise<AgentEntity> {
    const raw = AgentAdapter.toPrisma(data) as any;
    const created = await this.prisma.agent.create({
      data: raw,
      include: { 
        user: true,
        subscriptions: { where: { status: 'active' }, include: { plan: true } }
      }
    });
    return this.enrichAgentRow(created);
  }

  async list(): Promise<AgentEntity[]> {
    const rows = await this.prisma.agent.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { 
        user: true,
        subscriptions: { where: { status: 'active' }, include: { plan: true } }
      },
    });
    return Promise.all(rows.map((row) => this.enrichAgentRow(row)));
  }

  async findById(id: string): Promise<AgentEntity | null> {
    const row = await this.prisma.agent.findUnique({
      where: { id },
      include: { 
        user: true,
        subscriptions: { where: { status: 'active' }, include: { plan: true } }
      },
    });
    if (!row) return null;
    return this.enrichAgentRow(row);
  }

  async findByUserId(userId: string): Promise<AgentEntity | null> {
    const row = await this.prisma.agent.findUnique({
      where: { userId },
      include: { 
        user: true,
        subscriptions: { where: { status: 'active' }, include: { plan: true } }
      },
    });
    if (!row) return null;
    return this.enrichAgentRow(row);
  }

  async update(data: AgentEntity): Promise<AgentEntity> {
    const exists = await this.prisma.agent.findUnique({
      where: { id: data.id },
    });
    if (!exists) throw new NotFoundException('Agent not found');
    const raw = AgentAdapter.toPrisma(data) as any;
    const updated = await this.prisma.agent.update({
      where: { id: data.id },
      data: raw,
      include: { 
        user: true,
        subscriptions: { where: { status: 'active' }, include: { plan: true } }
      },
    });
    return this.enrichAgentRow(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.agent.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Agent not found');
    await this.prisma.agent.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.agent.count();
  }

  async listPending(): Promise<AgentEntity[]> {
    const rows = await this.prisma.agent.findMany({
      where: { isVerified: false },
      orderBy: { createdAt: 'asc' },
      include: { 
        user: true,
        subscriptions: { where: { status: 'active' }, include: { plan: true } }
      },
    });
    return Promise.all(rows.map((row) => this.enrichAgentRow(row)));
  }
}
