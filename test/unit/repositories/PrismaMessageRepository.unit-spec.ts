import { PrismaMessageRepository } from '../../../src/repositories/implementation/PrismaMessageRepository';
import { PrismaService } from '../../../src/shared';
import { mockPrismaService } from '../../setup/mocks';

describe('PrismaMessageRepository (Unit)', () => {
  let repository: PrismaMessageRepository;
  let prisma: typeof mockPrismaService;

  beforeEach(() => {
    prisma = { ...mockPrismaService };
    repository = new PrismaMessageRepository(prisma as any);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a message successfully', async () => {
      // TODO: Implement test
    });
  });
});
