import { PrismaScheduledVisitRepository } from '../../../src/repositories/implementation/PrismaScheduledVisitRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaScheduledVisitRepository (Unit)', () => {
  let repository: PrismaScheduledVisitRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaScheduledVisitRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a scheduled-visit successfully', async () => {
      // TODO: Implement test
    });
  });
});
