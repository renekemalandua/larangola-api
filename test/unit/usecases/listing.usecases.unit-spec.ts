import { BadRequestException } from '@nestjs/common';
import { ListingEntity } from '../../../src/entities/listing.entity';
import { IListingRepository } from '../../../src/repositories/IListingRepository';
import { IdValueObject } from '../../../src/shared';

describe('Listing Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IListingRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreateListingUseCase', () => {
    it('should create a listing successfully', async () => {
      // TODO: Implement test
    });
  });
});
