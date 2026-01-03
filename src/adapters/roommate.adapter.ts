import { Roommate } from '@prisma/client';
import { RoommateEntity } from '../entities/roommate.entity';
import { IdValueObject } from '../shared';

export class RoommateAdapter {
	static toDomain(raw: Roommate): RoommateEntity {
		return RoommateEntity.create(
			{
				userId: raw.userId,
				age: raw.age ?? null,
				profession: raw.profession ?? null,
				company: raw.company ?? null,
				location: raw.location ?? null,
				budget: raw.budget ?? null,
				moveInDate: raw.moveInDate ?? null,
				bio: raw.bio ?? null,
				isVerified: raw.isVerified,
				responseRate: raw.responseRate ?? null,
				averageResponseTime: raw.averageResponseTime ?? null,
				rating: raw.rating ?? null,
				lookingForRoommate: raw.lookingForRoommate,
				preferences: raw.preferences as unknown,
				lifestyle: raw.lifestyle as unknown,
				interests: raw.interests as unknown,
				languages: raw.languages as unknown,
				joinDate: raw.joinDate,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: RoommateEntity): Roommate {
		return {
			id: entity.id,
			userId: entity.userId,
			age: entity.age,
			profession: entity.profession,
			company: entity.company,
			location: entity.location,
			budget: entity.budget,
			moveInDate: entity.moveInDate,
			bio: entity.bio,
			isVerified: entity.isVerified,
			responseRate: entity.responseRate,
			averageResponseTime: entity.averageResponseTime,
			rating: entity.rating,
			lookingForRoommate: entity.lookingForRoommate,
			preferences: entity.preferences as any,
			lifestyle: entity.lifestyle as any,
			interests: entity.interests as any,
			languages: entity.languages as any,
			joinDate: entity.joinDate,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(entity: RoommateEntity): any {
		return {
			id: entity.id,
			userId: entity.userId,
			age: entity.age,
			profession: entity.profession,
			company: entity.company,
			location: entity.location,
			budget: entity.budget,
			moveInDate: entity.moveInDate,
			bio: entity.bio,
			isVerified: entity.isVerified,
			responseRate: entity.responseRate,
			averageResponseTime: entity.averageResponseTime,
			rating: entity.rating,
			lookingForRoommate: entity.lookingForRoommate,
			preferences: entity.preferences,
			lifestyle: entity.lifestyle,
			interests: entity.interests,
			languages: entity.languages,
			joinDate: entity.joinDate,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}

