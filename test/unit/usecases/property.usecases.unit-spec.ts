import { BadRequestException } from '@nestjs/common';
import { PropertyEntity } from '../../../src/entities/property.entity';
import { IPropertyRepository } from '../../../src/repositories/IPropertyRepository';
import { IdValueObject } from '../../../src/shared';

describe('Property Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IPropertyRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreatePropertyUseCase', () => {
    it('should create a property successfully', async () => {
      // TODO: Implement test
    });
  });
});
