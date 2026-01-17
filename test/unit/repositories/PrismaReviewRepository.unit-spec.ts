import { PrismaReviewRepository } from '../../../src/repositories/implementation/PrismaReviewRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaReviewRepository (Unit)', () => {
  let repository: PrismaReviewRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaReviewRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a review successfully', async () => {
      // TODO: Implement test
    });
  });
});
