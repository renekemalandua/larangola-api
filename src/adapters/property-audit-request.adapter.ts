import { PropertyAuditRequest } from '../entities/PropertyAuditRequest';

export class PropertyAuditRequestAdapter {
  static toHttp(entity: PropertyAuditRequest) {
    return {
      id: entity.id,
      userId: entity.userId,
      title: entity.title,
      description: entity.description,
      address: entity.address,
      city: entity.city,
      state: entity.state,
      bedrooms: entity.bedrooms,
      bathrooms: entity.bathrooms,
      area: entity.area,
      price: entity.price,
      currency: entity.currency,
      propertyType: entity.propertyType,
      listingType: entity.listingType,
      images: entity.images,
      status: entity.status,
      notes: entity.notes,
      claimedByAgentId: entity.claimedByAgentId,
      claimedAt: entity.claimedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static fromDb(data: any): PropertyAuditRequest | null {
    if (!data) return null;
    return new PropertyAuditRequest(
      data.id,
      data.userId,
      data.title,
      data.description,
      data.address,
      data.city,
      data.state,
      data.bedrooms,
      data.bathrooms,
      data.area,
      data.price,
      data.currency,
      data.propertyType,
      data.listingType,
      data.images,
      data.status,
      data.notes,
      data.claimedByAgentId,
      data.claimedAt,
      data.createdAt,
      data.updatedAt
    );
  }
}
