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
      updatedAt: entity.updatedAt,
      claimedAgent: entity.claimedAgent,
      user: entity.user,
    };
  }

  static fromDb(data: any): PropertyAuditRequest | null {
    if (!data) return null;
    const req = new PropertyAuditRequest(
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

    if (data.claimedAgent && data.claimedAgent.user) {
      req.claimedAgent = {
        name: data.claimedAgent.user.name,
        phone: data.claimedAgent.user.phone,
      };
    } else if (data.claimedAgent && data.claimedAgent.name) {
      // In case we mocked it or it came differently structured
      req.claimedAgent = {
        name: data.claimedAgent.name,
        phone: data.claimedAgent.phone,
      };
    }

    if (data.user) {
      req.user = {
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
      };
    }

    return req;
  }
}
