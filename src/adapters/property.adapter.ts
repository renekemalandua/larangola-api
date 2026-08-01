import {
  Property,
  ListingType as PrismaListingType,
  PropertyStatus as PrismaPropertyStatus,
} from '@prisma/client';
import {
  PropertyEntity,
  ListingType,
  PropertyStatus,
} from '../entities/property.entity';
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
        rules: raw.rules as unknown,

        listingType: raw.listingType as ListingType,
        price: raw.price,
        currency: raw.currency,
        status: raw.status as PropertyStatus,

        submittedForApprovalAt: (raw as any).submittedForApprovalAt ?? null,
        rejectionReason: (raw as any).rejectionReason ?? null,
        reviewedBy: (raw as any).reviewedBy ?? null,
        reviewedAt: (raw as any).reviewedAt ?? null,
        statusUpdatedAt: (raw as any).statusUpdatedAt ?? null,

        isHighlighted: (raw as any).isHighlighted ?? false,
        highlightedUntil: (raw as any).highlightedUntil ?? null,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        interactionCount: (raw as any).interactionCount ?? null,
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
      rules: entity.rules as any,

      listingType: entity.listingType as PrismaListingType,
      price: entity.price,
      currency: entity.currency,
      status: entity.status as PrismaPropertyStatus,

      submittedForApprovalAt: entity.submittedForApprovalAt ?? undefined,
      rejectionReason: entity.rejectionReason ?? undefined,
      reviewedBy: entity.reviewedBy ?? undefined,
      reviewedAt: entity.reviewedAt ?? undefined,
      statusUpdatedAt: entity.statusUpdatedAt ?? undefined,

      isHighlighted: entity.isHighlighted ?? false,
      highlightedUntil: entity.highlightedUntil ?? undefined,

      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    } as any;
  }

  static toHttp(entity: any, agent?: any): any {
    // Robustly handle both Entity and Prisma POJO
    const getData = (field: string) => {
      if (entity.props && typeof entity[field] === 'function')
        return entity[field]();
      if (entity.props) return entity.props[field];
      return entity[field];
    };

    // Allow agent to be passed explicitly, or fall back to entity.agent (set by enrichProperty)
    const resolvedAgent = agent ?? entity.agent ?? null;

    const id = entity.id || (entity.props ? entity.props.id : null);

    return {
      id: id,
      agentId: entity.agentId || entity.props?.agentId,
      categoryId: entity.categoryId || entity.props?.categoryId,
      title: entity.title || entity.props?.title,
      description: entity.description || entity.props?.description,
      address: entity.address || entity.props?.address,
      city: entity.city || entity.props?.city,
      state: entity.state || entity.props?.state,
      country: entity.country || entity.props?.country || 'Angola',
      latitude: entity.latitude || entity.props?.latitude,
      longitude: entity.longitude || entity.props?.longitude,
      bedrooms: entity.bedrooms || entity.props?.bedrooms,
      bathrooms: entity.bathrooms || entity.props?.bathrooms,
      area: entity.area || entity.props?.area,
      propertyType: entity.propertyType || entity.props?.propertyType,
      amenities: entity.amenities || entity.props?.amenities,
      images: entity.images || entity.props?.images,
      photos: entity.images || entity.props?.images || [],
      rules: entity.rules || entity.props?.rules || [],

      listingType: entity.listingType || entity.props?.listingType,
      price: entity.price || entity.props?.price,
      currency: entity.currency || entity.props?.currency || 'AOA',
      status: entity.status || entity.props?.status,

      submittedForApprovalAt: entity.submittedForApprovalAt || entity.props?.submittedForApprovalAt || null,
      rejectionReason: entity.rejectionReason || entity.props?.rejectionReason || null,
      reviewedBy: entity.reviewedBy || entity.props?.reviewedBy || null,
      reviewedAt: entity.reviewedAt || entity.props?.reviewedAt || null,

      isHighlighted: entity.isHighlighted !== undefined ? entity.isHighlighted : (entity.props?.isHighlighted || false),
      highlightedUntil: entity.highlightedUntil || entity.props?.highlightedUntil || null,

      statusUpdatedAt: entity.statusUpdatedAt || entity.props?.statusUpdatedAt || null,
      interactionCount: entity.interactionCount || entity.props?.interactionCount || null,
      createdAt: entity.createdAt || entity.props?.createdAt,
      updatedAt: entity.updatedAt || entity.props?.updatedAt,
      agent: resolvedAgent
        ? {
            id: resolvedAgent.id,
            userId: resolvedAgent.userId,
            company: resolvedAgent.company,
            isVerified: !!resolvedAgent.isVerified,
            user: {
              id: resolvedAgent.user?.id || resolvedAgent.userId,
              name: resolvedAgent.user?.name || resolvedAgent.name || 'Agente LarAngola',
              email: resolvedAgent.user?.email || '',
              phone: resolvedAgent.user?.phone || resolvedAgent.phone || '',
              avatar: resolvedAgent.user?.avatar || resolvedAgent.avatar || null,
            }
          }
        : null,
    };
  }
}
