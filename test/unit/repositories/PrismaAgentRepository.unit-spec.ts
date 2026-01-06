import { PrismaAgentRepository } from '../../../src/repositories/implementation/PrismaAgentRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaAgentRepository (Unit)', () => {
  let repository: PrismaAgentRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaAgentRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a agent successfully', async () => {
      // TODO: Implement test
    });
  });
});
