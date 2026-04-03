import { ReviewEntity } from '../entities/review.entity';

export abstract class IReviewRepository {
  abstract create(data: ReviewEntity): Promise<ReviewEntity>;
  abstract list(): Promise<ReviewEntity[]>;
  abstract listByProperty(propertyId: string): Promise<ReviewEntity[]>;
  abstract listByToUser(toUserId: string): Promise<ReviewEntity[]>;
  abstract findById(id: string): Promise<ReviewEntity | null>;
  abstract update(data: ReviewEntity): Promise<ReviewEntity>;
  abstract delete(id: string): Promise<void>;
  abstract findByUserIdAndRole(
    userId: string,
    role: string
  ): Promise<ReviewEntity[]>;
  abstract countByUserIdAndRole(userId: string, role: string): Promise<number>;
  abstract findByCompositeKey(
    fromUserId: string,
    toUserId: string,
    role: string
  ): Promise<ReviewEntity | null>;
}
