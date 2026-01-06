import { PrismaClosedDealRepository } from '../../../src/repositories/implementation/PrismaClosedDealRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaClosedDealRepository (Unit)', () => {
  let repository: PrismaClosedDealRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaClosedDealRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a closed-deal successfully', async () => {
      // TODO: Implement test
    });
  });
});
