import { PropertyRequest } from '@prisma/client';
import { PropertyRequestEntity } from '../entities/property-request.entity';
import { IdValueObject } from '../shared';

export class PropertyRequestAdapter {
  static toDomain(raw: PropertyRequest): PropertyRequestEntity {
    return PropertyRequestEntity.create(
      {
        userId: raw.userId,
        title: raw.title,
        description: raw.description ?? null,
        location: raw.location,
        propertyType: raw.propertyType,
        minPrice: raw.minPrice ?? null,
        maxPrice: raw.maxPrice ?? null,
        bedrooms: raw.bedrooms ?? null,
        bathrooms: raw.bathrooms ?? null,
        status: raw.status,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new IdValueObject(raw.id)
    );
  }

  static toPrisma(entity: PropertyRequestEntity): PropertyRequest {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      location: entity.location,
      propertyType: entity.propertyType,
      minPrice: entity.minPrice,
      maxPrice: entity.maxPrice,
      bedrooms: entity.bedrooms,
      bathrooms: entity.bathrooms,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toHttp(entity: PropertyRequestEntity): any {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      location: entity.location,
      propertyType: entity.propertyType,
      minPrice: entity.minPrice,
      maxPrice: entity.maxPrice,
      bedrooms: entity.bedrooms,
      bathrooms: entity.bathrooms,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
