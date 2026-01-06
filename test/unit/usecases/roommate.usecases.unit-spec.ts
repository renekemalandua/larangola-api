import { BadRequestException } from '@nestjs/common';
import { RoommateEntity } from '../../../src/entities/roommate.entity';
import { IRoommateRepository } from '../../../src/repositories/IRoommateRepository';
import { IdValueObject } from '../../../src/shared';

describe('Roommate Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IRoommateRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreateRoommateUseCase', () => {
    it('should create a roommate successfully', async () => {
      // TODO: Implement test
    });
  });
});
