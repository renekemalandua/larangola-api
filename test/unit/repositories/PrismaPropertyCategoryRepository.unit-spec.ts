import { PrismaPropertyCategoryRepository } from '../../../src/repositories/implementation/PrismaPropertyCategoryRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaPropertyCategoryRepository (Unit)', () => {
  let repository: PrismaPropertyCategoryRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaPropertyCategoryRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a property-category successfully', async () => {
      // TODO: Implement test
    });
  });
});
