import { PrismaAgentPlanRepository } from '../../../src/repositories/implementation/PrismaAgentPlanRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaAgentPlanRepository (Unit)', () => {
  let repository: PrismaAgentPlanRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaAgentPlanRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a agent-plan successfully', async () => {
      // TODO: Implement test
    });
  });
});
