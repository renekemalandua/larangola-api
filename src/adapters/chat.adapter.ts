import { Chat } from '@prisma/client';
import { ChatEntity } from '../entities/chat.entity';
import { IdValueObject } from '../shared';

export class ChatAdapter {
  static toDomain(raw: Chat): ChatEntity {
    return ChatEntity.create(
      {
        user1Id: raw.user1Id,
        user2Id: raw.user2Id,
        lastMessage: raw.lastMessage ?? null,
        lastMessageTime: raw.lastMessageTime ?? null,
        unreadCountUser1: raw.unreadCountUser1,
        unreadCountUser2: raw.unreadCountUser2,
        isBlocked: raw.isBlocked,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new IdValueObject(raw.id)
    );
  }

  static toPrisma(entity: ChatEntity): Chat {
    return {
      id: entity.id,
      user1Id: entity.user1Id,
      user2Id: entity.user2Id,
      lastMessage: entity.lastMessage,
      lastMessageTime: entity.lastMessageTime,
      unreadCountUser1: entity.unreadCountUser1,
      unreadCountUser2: entity.unreadCountUser2,
      isBlocked: entity.isBlocked,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toHttp(entity: ChatEntity): any {
    return {
      id: entity.id,
      user1Id: entity.user1Id,
      user2Id: entity.user2Id,
      lastMessage: entity.lastMessage,
      lastMessageTime: entity.lastMessageTime,
      unreadCountUser1: entity.unreadCountUser1,
      unreadCountUser2: entity.unreadCountUser2,
      isBlocked: entity.isBlocked,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
