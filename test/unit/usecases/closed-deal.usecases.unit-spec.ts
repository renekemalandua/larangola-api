import { BadRequestException } from '@nestjs/common';
import { ClosedDealEntity } from '../../../src/entities/closed-deal.entity';
import { IClosedDealRepository } from '../../../src/repositories/IClosedDealRepository';
import { IdValueObject } from '../../../src/shared';

describe('ClosedDeal Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IClosedDealRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreateClosedDealUseCase', () => {
    it('should create a closed-deal successfully', async () => {
      // TODO: Implement test
    });
  });
});
