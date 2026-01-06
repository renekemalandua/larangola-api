import { PrismaPropertyInterestRepository } from '../../../src/repositories/implementation/PrismaPropertyInterestRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaPropertyInterestRepository (Unit)', () => {
  let repository: PrismaPropertyInterestRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaPropertyInterestRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a property-interest successfully', async () => {
      // TODO: Implement test
    });
  });
});
