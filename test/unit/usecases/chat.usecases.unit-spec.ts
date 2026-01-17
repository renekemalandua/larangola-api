import { BadRequestException } from '@nestjs/common';
import { ChatEntity } from '../../../src/entities/chat.entity';
import { IChatRepository } from '../../../src/repositories/IChatRepository';
import { IdValueObject } from '../../../src/shared';

describe('Chat Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IChatRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreateChatUseCase', () => {
    it('should create a chat successfully', async () => {
      // TODO: Implement test
    });
  });
});
