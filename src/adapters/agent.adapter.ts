import { Agent } from '@prisma/client';
import { AgentEntity } from '../entities/agent.entity';
import { IdValueObject } from '../shared';

export class AgentAdapter {
  static toDomain(raw: Agent): AgentEntity {
    return AgentEntity.create(
      {
        userId: raw.userId,
        profession: raw.profession ?? null,
        company: raw.company ?? null,
        location: raw.location ?? null,
        bio: raw.bio ?? null,
        description: raw.description ?? null,
        isVerified: raw.isVerified,
        responseRate: raw.responseRate ?? null,
        averageResponseTime: raw.averageResponseTime ?? null,
        propertiesCount: raw.propertiesCount,
        averageRating: raw.averageRating,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new IdValueObject(raw.id)
    );
  }

  static toPrisma(entity: AgentEntity): Agent {
    return {
      id: entity.id,
      userId: entity.userId,
      profession: entity.profession,
      company: entity.company,
      location: entity.location,
      bio: entity.bio,
      description: entity.description,
      isVerified: entity.isVerified,
      responseRate: entity.responseRate,
      averageResponseTime: entity.averageResponseTime,
      propertiesCount: entity.propertiesCount,
      averageRating: entity.averageRating,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toHttp(entity: any): any {
    const reviewCount = entity.reviewCount || 0;
    const hasMinimumReviews = reviewCount >= 3;
    const averageRating = entity.averageRating || 0;

    return {
      id: entity.id,
      userId: entity.userId,
      profession: entity.profession,
      company: entity.company,
      location: entity.location,
      bio: entity.bio,
      description: entity.description,
      isVerified: entity.isVerified,
      responseRate: entity.responseRate,
      averageResponseTime: entity.averageResponseTime,
      propertiesCount: entity.propertiesCount,
      averageRating: averageRating,
      reviewCount: reviewCount,
      hasMinimumReviews: hasMinimumReviews,
      displayRating: hasMinimumReviews ? averageRating.toFixed(1) : null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      user: entity.user ? {
        id: entity.user.id,
        name: entity.user.name,
        email: entity.user.email,
        phone: entity.user.phone,
        avatar: entity.user.avatar,
      } : null,
    };
  }
}
