import { Property } from '@prisma/client';
import { PropertyEntity } from '../entities/property.entity';
import { IdValueObject } from '../shared';

export class PropertyAdapter {
	static toDomain(raw: Property): PropertyEntity {
		return PropertyEntity.create(
			{
				ownerId: raw.ownerId,
				categoryId: raw.categoryId,
				title: raw.title,
				description: raw.description ?? null,
				address: raw.address ?? null,
				city: raw.city ?? null,
				state: raw.state ?? null,
				country: raw.country ?? 'Angola',
				latitude: raw.latitude ?? null,
				longitude: raw.longitude ?? null,
				bedrooms: raw.bedrooms ?? null,
				bathrooms: raw.bathrooms ?? null,
				area: raw.area ?? null,
				propertyType: raw.propertyType,
				amenities: raw.amenities as unknown,
				images: raw.images as unknown,
				createdAt: raw.createdAt,
				updatedAt: raw.updatedAt,
			},
			new IdValueObject(raw.id),
		);
	}

	static toPrisma(entity: PropertyEntity): Property {
		return {
			id: entity.id,
			ownerId: entity.ownerId,
			categoryId: entity.categoryId,
			title: entity.title,
			description: entity.description,
			address: entity.address,
			city: entity.city,
			state: entity.state,
			country: entity.country,
			latitude: entity.latitude,
			longitude: entity.longitude,
			bedrooms: entity.bedrooms,
			bathrooms: entity.bathrooms,
			area: entity.area,
			propertyType: entity.propertyType,
			amenities: entity.amenities as any,
			images: entity.images as any,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	static toHttp(entity: PropertyEntity): any {
		return {
			id: entity.id,
			ownerId: entity.ownerId,
			categoryId: entity.categoryId,
			title: entity.title,
			description: entity.description,
			address: entity.address,
			city: entity.city,
			state: entity.state,
			country: entity.country,
			latitude: entity.latitude,
			longitude: entity.longitude,
			bedrooms: entity.bedrooms,
			bathrooms: entity.bathrooms,
			area: entity.area,
			propertyType: entity.propertyType,
			amenities: entity.amenities,
			images: entity.images,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}
}

