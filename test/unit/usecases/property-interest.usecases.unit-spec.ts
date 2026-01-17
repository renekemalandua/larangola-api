import { BadRequestException } from '@nestjs/common';
import { PropertyInterestEntity } from '../../../src/entities/property-interest.entity';
import { IPropertyInterestRepository } from '../../../src/repositories/IPropertyInterestRepository';
import { IdValueObject } from '../../../src/shared';

describe('PropertyInterest Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IPropertyInterestRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreatePropertyInterestUseCase', () => {
    it('should create a property-interest successfully', async () => {
      // TODO: Implement test
    });
  });
});
