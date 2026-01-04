import { AgentSubscription, SubscriptionStatus as SubscriptionStatusPrisma } from '@prisma/client';
import { AgentSubscriptionEntity, SubscriptionStatus } from '../entities/agent-subscription.entity';
import { IdValueObject } from '../shared';

export class AgentSubscriptionAdapter {
	static toDomain(raw: AgentSubscription): AgentSubscriptionEntity {
		return AgentSubscriptionEntity.create(
			{
				agentId: raw.agentId,
				planId: raw.planId,
				status: raw.status as SubscriptionStatus,
				startDate: raw.startDate,
				endDate: raw.endDate ?? null,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: AgentSubscriptionEntity): AgentSubscription {
		return {
			id: entity.id,
			agentId: entity.agentId,
			planId: entity.planId,
			status: entity.status as SubscriptionStatusPrisma,
			startDate: entity.startDate,
			endDate: entity.endDate,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(entity: AgentSubscriptionEntity): any {
		return {
			id: entity.id,
			agentId: entity.agentId,
			planId: entity.planId,
			status: entity.status,
			startDate: entity.startDate,
			endDate: entity.endDate,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}


