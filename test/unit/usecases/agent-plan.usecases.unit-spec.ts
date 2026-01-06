import { BadRequestException } from '@nestjs/common';
import { AgentPlanEntity } from '../../../src/entities/agent-plan.entity';
import { IAgentPlanRepository } from '../../../src/repositories/IAgentPlanRepository';
import { IdValueObject } from '../../../src/shared';

describe('AgentPlan Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IAgentPlanRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreateAgentPlanUseCase', () => {
    it('should create a agent-plan successfully', async () => {
      // TODO: Implement test
    });
  });
});
