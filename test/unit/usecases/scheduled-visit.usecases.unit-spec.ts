import { BadRequestException } from '@nestjs/common';
import { ScheduledVisitEntity } from '../../../src/entities/scheduled-visit.entity';
import { IScheduledVisitRepository } from '../../../src/repositories/IScheduledVisitRepository';
import { IdValueObject } from '../../../src/shared';

describe('ScheduledVisit Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IScheduledVisitRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreateScheduledVisitUseCase', () => {
    it('should create a scheduled-visit successfully', async () => {
      // TODO: Implement test
    });
  });
});
