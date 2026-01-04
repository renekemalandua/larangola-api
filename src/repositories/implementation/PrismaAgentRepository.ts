import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IAgentRepository } from '../IAgentRepository';
import { AgentEntity } from '../../entities/agent.entity';
import { AgentAdapter } from '../../adapters/agent.adapter';

@Injectable()
export class PrismaAgentRepository implements IAgentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: AgentEntity): Promise<AgentEntity> {
    const raw = AgentAdapter.toPrisma(data) as any;
    const created = await this.prisma.agent.create({ data: raw });
    return AgentAdapter.toDomain(created);
  }

  async list(): Promise<AgentEntity[]> {
    const rows = await this.prisma.agent.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(AgentAdapter.toDomain);
  }

  async findById(id: string): Promise<AgentEntity | null> {
    const row = await this.prisma.agent.findUnique({ where: { id } });
    return row ? AgentAdapter.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<AgentEntity | null> {
    const row = await this.prisma.agent.findUnique({ where: { userId } });
    return row ? AgentAdapter.toDomain(row) : null;
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
    });
    return AgentAdapter.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.agent.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Agent not found');
    await this.prisma.agent.delete({ where: { id } });
  }
}
