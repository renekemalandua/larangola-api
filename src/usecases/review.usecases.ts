import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { ReviewEntity } from '../entities/review.entity';
import { IReviewRepository } from '../repositories/IReviewRepository';
import {
  CreateReviewRequestDTO,
  UpdateReviewRequestDTO,
} from '../dto/review.dto';

import { IAgentRepository } from '../repositories/IAgentRepository';
import { IRoommateRepository } from '../repositories/IRoommateRepository';
import { ReviewRole } from '@prisma/client';

@Injectable()
export class CreateReviewUseCase implements UseCase<
  CreateReviewRequestDTO,
  ReviewEntity
> {
  constructor(
    private readonly repository: IReviewRepository,
    private readonly agentRepository: IAgentRepository,
    private readonly roommateRepository: IRoommateRepository
  ) {}

  async execute(request: CreateReviewRequestDTO): Promise<ReviewEntity> {
    // Check for existing review
    const existing = await this.repository.findByCompositeKey(
      request.fromUserId,
      request.toUserId,
      request.role
    );

    if (existing) {
      throw new BadRequestException(
        'You have already reviewed this user in this role.'
      );
    }

    const entity = ReviewEntity.create(request);
    const created = await this.repository.create(entity);

    await this.updateUserRating(request.toUserId, request.role);

    return created;
  }

  private async updateUserRating(userId: string, role: string) {
    const reviews = await this.repository.findByUserIdAndRole(userId, role);
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    if (role === ReviewRole.AGENT) {
      const agent = await this.agentRepository.findByUserId(userId);
      if (agent) {
        agent.averageRating = averageRating;
        await this.agentRepository.update(agent);
      }
    } else if (role === ReviewRole.ROOMMATE) {
      const roommate = await this.roommateRepository.findByUserId(userId);
      if (roommate) {
        roommate.rating = averageRating;
        await this.roommateRepository.update(roommate);
      }
    }
  }
}

@Injectable()
export class UpdateReviewUseCase implements UseCase<
  { id: string; data: UpdateReviewRequestDTO },
  ReviewEntity
> {
  constructor(
    private readonly repository: IReviewRepository,
    private readonly agentRepository: IAgentRepository,
    private readonly roommateRepository: IRoommateRepository
  ) {}

  async execute({
    id,
    data,
  }: {
    id: string;
    data: UpdateReviewRequestDTO;
  }): Promise<ReviewEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Review not found');

    const oldRating = entity.rating;
    const { toUserId, role } = entity;

    if (data.rating !== undefined) entity.rating = data.rating;
    if (data.comment !== undefined) entity.comment = data.comment ?? null;

    const updated = await this.repository.update(entity);

    // Recalcular média se rating mudou
    if (oldRating !== updated.rating) {
      await this.updateUserRating(toUserId, role);
    }

    return updated;
  }

  private async updateUserRating(userId: string, role: string) {
    const reviews = await this.repository.findByUserIdAndRole(userId, role);
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    if (role === ReviewRole.AGENT) {
      const agent = await this.agentRepository.findByUserId(userId);
      if (agent) {
        agent.averageRating = averageRating;
        await this.agentRepository.update(agent);
      }
    } else if (role === ReviewRole.ROOMMATE) {
      const roommate = await this.roommateRepository.findByUserId(userId);
      if (roommate) {
        roommate.rating = averageRating;
        await this.roommateRepository.update(roommate);
      }
    }
  }
}

@Injectable()
export class DeleteReviewUseCase implements UseCase<string, void> {
  constructor(
    private readonly repository: IReviewRepository,
    private readonly agentRepository: IAgentRepository,
    private readonly roommateRepository: IRoommateRepository
  ) {}

  async execute(id: string): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Review not found');

    const { toUserId, role } = entity;
    await this.repository.delete(id);

    // Recalcular média após deletar
    await this.updateUserRating(toUserId, role);
  }

  private async updateUserRating(userId: string, role: string) {
    const reviews = await this.repository.findByUserIdAndRole(userId, role);
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    if (role === ReviewRole.AGENT) {
      const agent = await this.agentRepository.findByUserId(userId);
      if (agent) {
        agent.averageRating = averageRating;
        await this.agentRepository.update(agent);
      }
    } else if (role === ReviewRole.ROOMMATE) {
      const roommate = await this.roommateRepository.findByUserId(userId);
      if (roommate) {
        roommate.rating = averageRating;
        await this.roommateRepository.update(roommate);
      }
    }
  }
}

@Injectable()
export class ListReviewsUseCase implements UseCase<void, ReviewEntity[]> {
  constructor(private readonly repository: IReviewRepository) {}
  async execute(): Promise<ReviewEntity[]> {
    return this.repository.list();
  }
}

@Injectable()
export class ListReviewsByPropertyUseCase implements UseCase<
  string,
  ReviewEntity[]
> {
  constructor(private readonly repository: IReviewRepository) {}
  async execute(propertyId: string): Promise<ReviewEntity[]> {
    return this.repository.listByProperty(propertyId);
  }
}

@Injectable()
export class ListReviewsByToUserUseCase implements UseCase<
  { toUserId: string; role?: string },
  ReviewEntity[]
> {
  constructor(private readonly repository: IReviewRepository) {}
  async execute({
    toUserId,
    role,
  }: {
    toUserId: string;
    role?: string;
  }): Promise<ReviewEntity[]> {
    if (role) {
      return this.repository.findByUserIdAndRole(toUserId, role);
    }
    return this.repository.listByToUser(toUserId);
  }
}

@Injectable()
export class FindReviewByIdUseCase implements UseCase<
  string,
  ReviewEntity | null
> {
  constructor(private readonly repository: IReviewRepository) {}
  async execute(id: string): Promise<ReviewEntity | null> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Review not found');
    return entity;
  }
}

export interface ReviewStatsResponse {
  averageRating: number;
  totalReviews: number;
  distribution: {
    '5': number;
    '4': number;
    '3': number;
    '2': number;
    '1': number;
  };
}

@Injectable()
export class GetReviewStatsUseCase implements UseCase<string, ReviewStatsResponse> {
  constructor(private readonly repository: IReviewRepository) {}

  async execute(userId: string): Promise<ReviewStatsResponse> {
    const reviews = await this.repository.findByUserIdAndRole(userId, ReviewRole.AGENT);
    
    let totalScore = 0;
    const distribution = { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 };

    for (const review of reviews) {
      totalScore += review.rating;
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating.toString() as keyof typeof distribution]++;
      }
    }

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? Number((totalScore / totalReviews).toFixed(1)) : 0;

    return {
      averageRating,
      totalReviews,
      distribution
    };
  }
}

@Injectable()
export class ListMyReviewsUseCase implements UseCase<string, any[]> {
  constructor(private readonly repository: IReviewRepository) {}

  async execute(userId: string): Promise<any[]> {
    const reviews = await this.repository.findByUserIdAndRole(userId, ReviewRole.AGENT);
    
    // Map to a clean presentation format for the frontend
    return reviews.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      clientName: review.fromUser?.name || 'Cliente',
      clientAvatar: review.fromUser?.profilePictureUrl || null
    }));
  }
}
