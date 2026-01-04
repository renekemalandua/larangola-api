import { Listing, ListingType as ListingTypePrisma, ListingStatus as ListingStatusPrisma } from '@prisma/client';
import { ListingEntity, ListingType, ListingStatus } from '../entities/listing.entity';
import { IdValueObject } from '../shared';

export class ListingAdapter {
	static toDomain(raw: Listing): ListingEntity {
		return ListingEntity.create(
			{
				propertyId: raw.propertyId,
				ownerId: raw.ownerId,
				listingType: raw.listingType as ListingType,
				price: raw.price,
				currency: raw.currency,
				status: raw.status as ListingStatus,
				listedBy: raw.listedBy,
				agentId: raw.agentId ?? null,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: ListingEntity): Listing {
		return {
			id: entity.id,
			propertyId: entity.propertyId,
			ownerId: entity.ownerId,
			listingType: entity.listingType as ListingTypePrisma,
			price: entity.price,
			currency: entity.currency,
			status: entity.status as ListingStatusPrisma,
			listedBy: entity.listedBy,
			agentId: entity.agentId,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(entity: ListingEntity): any {
		return {
			id: entity.id,
			propertyId: entity.propertyId,
			ownerId: entity.ownerId,
			listingType: entity.listingType,
			price: entity.price,
			currency: entity.currency,
			status: entity.status,
			listedBy: entity.listedBy,
			agentId: entity.agentId,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}


