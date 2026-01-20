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
  ) { }

  async execute(request: CreateReviewRequestDTO): Promise<ReviewEntity> {
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
  constructor(private readonly repository: IReviewRepository) { }
  async execute({
    id,
    data,
  }: {
    id: string;
    data: UpdateReviewRequestDTO;
  }): Promise<ReviewEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Review not found');
    if (data.rating !== undefined) entity.rating = data.rating;
    if (data.comment !== undefined) entity.comment = data.comment ?? null;
    return this.repository.update(entity);
  }
}

@Injectable()
export class DeleteReviewUseCase implements UseCase<string, void> {
  constructor(private readonly repository: IReviewRepository) { }
  async execute(id: string): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Review not found');
    await this.repository.delete(id);
  }
}

@Injectable()
export class ListReviewsUseCase implements UseCase<void, ReviewEntity[]> {
  constructor(private readonly repository: IReviewRepository) { }
  async execute(): Promise<ReviewEntity[]> {
    return this.repository.list();
  }
}

@Injectable()
export class ListReviewsByListingUseCase implements UseCase<
  string,
  ReviewEntity[]
> {
  constructor(private readonly repository: IReviewRepository) { }
  async execute(listingId: string): Promise<ReviewEntity[]> {
    return this.repository.listByListing(listingId);
  }
}

@Injectable()
export class ListReviewsByToUserUseCase implements UseCase<
  string,
  ReviewEntity[]
> {
  constructor(private readonly repository: IReviewRepository) { }
  async execute(toUserId: string): Promise<ReviewEntity[]> {
    return this.repository.listByToUser(toUserId);
  }
}

@Injectable()
export class FindReviewByIdUseCase implements UseCase<
  string,
  ReviewEntity | null
> {
  constructor(private readonly repository: IReviewRepository) { }
  async execute(id: string): Promise<ReviewEntity | null> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Review not found');
    return entity;
  }
}
