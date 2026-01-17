import { BadRequestException } from '@nestjs/common';
import { MessageEntity } from '../../../src/entities/message.entity';
import { IMessageRepository } from '../../../src/repositories/IMessageRepository';
import { IdValueObject } from '../../../src/shared';

describe('Message Use Cases (Unit)', () => {
  let mockRepository: jest.Mocked<IMessageRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      list: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;
  });

  describe('CreateMessageUseCase', () => {
    it('should create a message successfully', async () => {
      // TODO: Implement test
    });
  });
});
