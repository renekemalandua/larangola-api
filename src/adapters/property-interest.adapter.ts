import { PropertyInterest } from '@prisma/client';
import { PropertyInterestEntity } from '../entities/property-interest.entity';
import { IdValueObject } from '../shared';

export class PropertyInterestAdapter {
  static toDomain(raw: any): PropertyInterestEntity {
    const entity = PropertyInterestEntity.create(
      {
        propertyId: raw.propertyId,
        userId: raw.userId,
        message: raw.message ?? null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new IdValueObject(raw.id)
    );

    // Attach related data if present
    if (raw.property) {
      (entity as any).property = raw.property;
    }
    if (raw.user) {
      (entity as any).user = raw.user;
    }

    return entity;
  }

  static toPrisma(entity: PropertyInterestEntity): PropertyInterest {
    return {
      id: entity.id,
      propertyId: entity.propertyId,
      userId: entity.userId,
      message: entity.message,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toHttp(entity: any): any {
    return {
      id: entity.id,
      propertyId: entity.propertyId,
      userId: entity.userId,
      message: entity.message,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      // Include related data if present
      property: entity.property || undefined,
      user: entity.user || undefined,
    };
  }
}
