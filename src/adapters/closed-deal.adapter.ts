import { ClosedDeal, ClosedDealStatus as ClosedDealStatusPrisma } from '@prisma/client';
import { ClosedDealEntity, ClosedDealStatus } from '../entities/closed-deal.entity';
import { IdValueObject } from '../shared';

export class ClosedDealAdapter {
	static toDomain(raw: ClosedDeal): ClosedDealEntity {
		return ClosedDealEntity.create(
			{
				listingId: raw.listingId,
				agentId: raw.agentId,
				clientId: raw.clientId,
				commissionAmount: raw.commissionAmount,
				commissionRate: raw.commissionRate,
				status: raw.status as ClosedDealStatus,
				closedDate: raw.closedDate,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: ClosedDealEntity): ClosedDeal {
		return {
			id: entity.id,
			listingId: entity.listingId,
			agentId: entity.agentId,
			clientId: entity.clientId,
			commissionAmount: entity.commissionAmount,
			commissionRate: entity.commissionRate,
			status: entity.status as ClosedDealStatusPrisma,
			closedDate: entity.closedDate,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(entity: ClosedDealEntity): any {
		return {
			id: entity.id,
			listingId: entity.listingId,
			agentId: entity.agentId,
			clientId: entity.clientId,
			commissionAmount: entity.commissionAmount,
			commissionRate: entity.commissionRate,
			status: entity.status,
			closedDate: entity.closedDate,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}


