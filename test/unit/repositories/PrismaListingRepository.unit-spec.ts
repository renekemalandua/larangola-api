import { PrismaListingRepository } from '../../../src/repositories/implementation/PrismaListingRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaListingRepository (Unit)', () => {
  let repository: PrismaListingRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaListingRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a listing successfully', async () => {
      // TODO: Implement test
    });
  });
});
