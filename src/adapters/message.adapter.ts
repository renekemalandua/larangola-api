import { Message } from '@prisma/client';
import { MessageEntity } from '../entities/message.entity';
import { IdValueObject } from '../shared';

export class MessageAdapter {
  static toDomain(raw: Message): MessageEntity {
    return MessageEntity.create(
      {
        chatId: raw.chatId,
        senderId: raw.senderId,
        text: raw.text,
        isRead: raw.isRead,
        createdAt: raw.createdAt,
      },
      new IdValueObject(raw.id)
    );
  }

  static toPrisma(entity: MessageEntity): Message {
    return {
      id: entity.id,
      chatId: entity.chatId,
      senderId: entity.senderId,
      text: entity.text,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
    };
  }

  static toHttp(entity: MessageEntity): any {
    return {
      id: entity.id,
      chatId: entity.chatId,
      senderId: entity.senderId,
      text: entity.text,
      isRead: entity.isRead,
      createdAt: entity.createdAt,
    };
  }
}
