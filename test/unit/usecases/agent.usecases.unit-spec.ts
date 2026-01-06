import { BadRequestException } from '@nestjs/common';
import { AgentEntity } from '../../../src/entities/agent.entity';
import { IAgentRepository } from '../../../src/repositories/IAgentRepository';
import { IdValueObject } from '../../../src/shared';

describe('Agent Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IAgentRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreateAgentUseCase', () => {
    it('should create a agent successfully', async () => {
      // TODO: Implement test
    });
  });
});
