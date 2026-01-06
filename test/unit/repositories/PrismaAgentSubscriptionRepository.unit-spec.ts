import { PrismaAgentSubscriptionRepository } from '../../../src/repositories/implementation/PrismaAgentSubscriptionRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaAgentSubscriptionRepository (Unit)', () => {
  let repository: PrismaAgentSubscriptionRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaAgentSubscriptionRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a agent-subscription successfully', async () => {
      // TODO: Implement test
    });
  });
});
