import { MessageEntity } from '../entities/message.entity';

export abstract class IMessageRepository {
  abstract create(data: MessageEntity): Promise<MessageEntity>;
  abstract list(): Promise<MessageEntity[]>;
  abstract listByChat(chatId: string): Promise<MessageEntity[]>;
  abstract findById(id: string): Promise<MessageEntity | null>;
  abstract update(data: MessageEntity): Promise<MessageEntity>;
  abstract delete(id: string): Promise<void>;
  abstract markAsRead(chatId: string, userId: string): Promise<void>;
}
