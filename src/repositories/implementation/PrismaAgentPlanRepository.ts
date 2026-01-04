import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IAgentPlanRepository } from '../IAgentPlanRepository';
import { AgentPlanEntity } from '../../entities/agent-plan.entity';
import { AgentPlanAdapter } from '../../adapters/agent-plan.adapter';

@Injectable()
export class PrismaAgentPlanRepository implements IAgentPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: AgentPlanEntity): Promise<AgentPlanEntity> {
    const raw = AgentPlanAdapter.toPrisma(data) as any;
    const created = await this.prisma.agentPlan.create({ data: raw });
    return AgentPlanAdapter.toDomain(created);
  }

  async list(): Promise<AgentPlanEntity[]> {
    const rows = await this.prisma.agentPlan.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(AgentPlanAdapter.toDomain);
  }

  async findById(id: string): Promise<AgentPlanEntity | null> {
    const row = await this.prisma.agentPlan.findUnique({ where: { id } });
    return row ? AgentPlanAdapter.toDomain(row) : null;
  }

  async update(data: AgentPlanEntity): Promise<AgentPlanEntity> {
    const exists = await this.prisma.agentPlan.findUnique({
      where: { id: data.id },
    });
    if (!exists) throw new NotFoundException('Agent plan not found');
    const raw = AgentPlanAdapter.toPrisma(data) as any;
    const updated = await this.prisma.agentPlan.update({
      where: { id: data.id },
      data: raw,
    });
    return AgentPlanAdapter.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.agentPlan.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Agent plan not found');
    await this.prisma.agentPlan.delete({ where: { id } });
  }
}
