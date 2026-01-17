import { BadRequestException } from '@nestjs/common';
import { PropertyCategoryEntity } from '../../../src/entities/property-category.entity';
import { IPropertyCategoryRepository } from '../../../src/repositories/IPropertyCategoryRepository';
import { IdValueObject } from '../../../src/shared';

describe('PropertyCategory Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IPropertyCategoryRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreatePropertyCategoryUseCase', () => {
    it('should create a property-category successfully', async () => {
      // TODO: Implement test
    });
  });
});
