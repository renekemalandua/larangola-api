import { PropertyCategory } from '@prisma/client';
import { PropertyCategoryEntity } from '../entities/property-category.entity';
import { IdValueObject } from '../shared';

export class PropertyCategoryAdapter {
  static toDomain(raw: PropertyCategory): PropertyCategoryEntity {
    return PropertyCategoryEntity.create(
      {
        name: raw.name,
        description: raw.description ?? null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new IdValueObject(raw.id)
    );
  }

  static toPrisma(entity: PropertyCategoryEntity): PropertyCategory {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toHttp(entity: PropertyCategoryEntity): any {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
