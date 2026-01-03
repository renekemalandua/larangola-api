import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IAgentSubscriptionRepository } from '../IAgentSubscriptionRepository';
import { AgentSubscriptionEntity } from '../../entities/agent-subscription.entity';
import { AgentSubscriptionAdapter } from '../../adapters/agent-subscription.adapter';

@Injectable()
export class PrismaAgentSubscriptionRepository implements IAgentSubscriptionRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: AgentSubscriptionEntity): Promise<AgentSubscriptionEntity> {
		const raw = AgentSubscriptionAdapter.toPrisma(data) as any;
		const created = await this.prisma.agentSubscription.create({ data: raw });
		return AgentSubscriptionAdapter.toDomain(created);
	}

	async list(): Promise<AgentSubscriptionEntity[]> {
		const rows = await this.prisma.agentSubscription.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(AgentSubscriptionAdapter.toDomain);
	}

	async listByAgent(agentId: string): Promise<AgentSubscriptionEntity[]> {
		const rows = await this.prisma.agentSubscription.findMany({ where: { agentId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(AgentSubscriptionAdapter.toDomain);
	}

	async findById(id: string): Promise<AgentSubscriptionEntity | null> {
		const row = await this.prisma.agentSubscription.findUnique({ where: { id } });
		return row ? AgentSubscriptionAdapter.toDomain(row) : null;
	}

	async update(data: AgentSubscriptionEntity): Promise<AgentSubscriptionEntity> {
		const exists = await this.prisma.agentSubscription.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('Agent subscription not found');
		const raw = AgentSubscriptionAdapter.toPrisma(data) as any;
		const updated = await this.prisma.agentSubscription.update({ where: { id: data.id }, data: raw });
		return AgentSubscriptionAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.agentSubscription.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Agent subscription not found');
		await this.prisma.agentSubscription.delete({ where: { id } });
	}
}

