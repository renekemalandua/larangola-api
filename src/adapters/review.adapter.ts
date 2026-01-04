import { Review } from '@prisma/client';
import { ReviewEntity } from '../entities/review.entity';
import { IdValueObject } from '../shared';

export class ReviewAdapter {
	static toDomain(raw: Review): ReviewEntity {
		return ReviewEntity.create(
			{
				listingId: raw.listingId ?? null,
				fromUserId: raw.fromUserId,
				toUserId: raw.toUserId,
				rating: raw.rating,
				comment: raw.comment ?? null,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: ReviewEntity): Review {
		return {
			id: entity.id,
			listingId: entity.listingId,
			fromUserId: entity.fromUserId,
			toUserId: entity.toUserId,
			rating: entity.rating,
			comment: entity.comment,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(entity: ReviewEntity): any {
		return {
			id: entity.id,
			listingId: entity.listingId,
			fromUserId: entity.fromUserId,
			toUserId: entity.toUserId,
			rating: entity.rating,
			comment: entity.comment,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}


