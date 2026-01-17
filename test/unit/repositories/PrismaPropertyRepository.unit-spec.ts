import { PrismaPropertyRepository } from '../../../src/repositories/implementation/PrismaPropertyRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaPropertyRepository (Unit)', () => {
  let repository: PrismaPropertyRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaPropertyRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a property successfully', async () => {
      // TODO: Implement test
    });
  });
});
