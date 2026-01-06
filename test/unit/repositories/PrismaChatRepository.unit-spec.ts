import { PrismaChatRepository } from '../../../src/repositories/implementation/PrismaChatRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaChatRepository (Unit)', () => {
  let repository: PrismaChatRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaChatRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a chat successfully', async () => {
      // TODO: Implement test
    });
  });
});
