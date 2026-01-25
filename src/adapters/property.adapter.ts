import { Property, ListingType as PrismaListingType, PropertyStatus as PrismaPropertyStatus } from '@prisma/client';
import { PropertyEntity, ListingType, PropertyStatus } from '../entities/property.entity';
import { IdValueObject } from '../shared';

export class PropertyAdapter {
  static toDomain(raw: Property): PropertyEntity {
    return PropertyEntity.create(
      {
        agentId: raw.agentId,
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

        listingType: raw.listingType as ListingType,
        price: raw.price,
        currency: raw.currency,
        status: raw.status as PropertyStatus,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new IdValueObject(raw.id)
    );
  }

  static toPrisma(entity: PropertyEntity): Property {
    return {
      id: entity.id,
      agentId: entity.agentId,
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

      listingType: entity.listingType as PrismaListingType,
      price: entity.price,
      currency: entity.currency,
      status: entity.status as PrismaPropertyStatus,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toHttp(entity: PropertyEntity): any {
    return {
      id: entity.id,
      agentId: entity.agentId,
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

      listingType: entity.listingType,
      price: entity.price,
      currency: entity.currency,
      status: entity.status,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
