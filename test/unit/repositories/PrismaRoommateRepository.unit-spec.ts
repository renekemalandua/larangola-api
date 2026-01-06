import { PrismaRoommateRepository } from '../../../src/repositories/implementation/PrismaRoommateRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaRoommateRepository (Unit)', () => {
  let repository: PrismaRoommateRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaRoommateRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a roommate successfully', async () => {
      // TODO: Implement test
    });
  });
});
