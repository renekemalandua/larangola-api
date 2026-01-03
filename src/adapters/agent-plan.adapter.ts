import { AgentPlan, PlanType as PlanTypePrisma } from '@prisma/client';
import { AgentPlanEntity, PlanType } from '../entities/agent-plan.entity';
import { IdValueObject } from '../shared';

export class AgentPlanAdapter {
	static toDomain(raw: AgentPlan): AgentPlanEntity {
		return AgentPlanEntity.create(
			{
				type: raw.type as PlanType,
				name: raw.name,
				price: raw.price,
				pricePeriod: raw.pricePeriod ?? null,
				description: raw.description ?? null,
				features: raw.features as unknown,
				isPopular: raw.isPopular,
				badge: raw.badge ?? null,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: AgentPlanEntity): AgentPlan {
		return {
			id: entity.id,
			type: entity.type as PlanTypePrisma,
			name: entity.name,
			price: entity.price,
			pricePeriod: entity.pricePeriod,
			description: entity.description,
			features: entity.features as any,
			isPopular: entity.isPopular,
			badge: entity.badge,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(entity: AgentPlanEntity): any {
		return {
			id: entity.id,
			type: entity.type,
			name: entity.name,
			price: entity.price,
			pricePeriod: entity.pricePeriod,
			description: entity.description,
			features: entity.features,
			isPopular: entity.isPopular,
			badge: entity.badge,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}

