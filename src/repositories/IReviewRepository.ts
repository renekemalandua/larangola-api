import { ReviewEntity } from '../entities/review.entity';

export abstract class IReviewRepository {
	abstract create(data: ReviewEntity): Promise<ReviewEntity>;
	abstract list(): Promise<ReviewEntity[]>;
	abstract listByListing(listingId: string): Promise<ReviewEntity[]>;
	abstract listByToUser(toUserId: string): Promise<ReviewEntity[]>;
	abstract findById(id: string): Promise<ReviewEntity | null>;
	abstract update(data: ReviewEntity): Promise<ReviewEntity>;
	abstract delete(id: string): Promise<void>;
}

