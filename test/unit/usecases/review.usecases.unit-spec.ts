import { BadRequestException } from '@nestjs/common';
import { ReviewEntity } from '../../../src/entities/review.entity';
import { IReviewRepository } from '../../../src/repositories/IReviewRepository';
import { IdValueObject } from '../../../src/shared';

describe('Review Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IReviewRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreateReviewUseCase', () => {
    it('should create a review successfully', async () => {
      // TODO: Implement test
    });
  });
});
