import { User } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';
import { IdValueObject } from '../shared';

export class UserAdapter {
	static toDomain(raw: User): UserEntity {
		return UserEntity.create(
			{
				email: raw.email,
				phone: raw.phone,
				password: raw.password,
				name: raw.name,
				avatar: raw.avatar ?? null,
				isActive: raw.isActive,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: UserEntity): User {
		return {
			id: entity.id,
			email: entity.email,
			phone: entity.phone,
			password: entity.password,
			name: entity.name,
			avatar: entity.avatar,
			isActive: entity.isActive,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(entity: UserEntity): any {
		return {
			id: entity.id,
			email: entity.email,
			phone: entity.phone,
			name: entity.name,
			avatar: entity.avatar,
			isActive: entity.isActive,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}


