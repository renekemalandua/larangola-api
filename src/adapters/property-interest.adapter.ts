import { PropertyInterest } from '@prisma/client';
import { PropertyInterestEntity } from '../entities/property-interest.entity';
import { IdValueObject } from '../shared';

export class PropertyInterestAdapter {
	static toDomain(raw: PropertyInterest): PropertyInterestEntity {
		return PropertyInterestEntity.create(
			{
				listingId: raw.listingId,
				userId: raw.userId,
				message: raw.message ?? null,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: PropertyInterestEntity): PropertyInterest {
		return {
			id: entity.id,
			listingId: entity.listingId,
			userId: entity.userId,
			message: entity.message,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(entity: PropertyInterestEntity): any {
		return {
			id: entity.id,
			listingId: entity.listingId,
			userId: entity.userId,
			message: entity.message,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}


