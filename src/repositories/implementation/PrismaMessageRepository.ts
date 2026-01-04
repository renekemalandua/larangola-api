import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IMessageRepository } from '../IMessageRepository';
import { MessageEntity } from '../../entities/message.entity';
import { MessageAdapter } from '../../adapters/message.adapter';

@Injectable()
export class PrismaMessageRepository implements IMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: MessageEntity): Promise<MessageEntity> {
    const raw = MessageAdapter.toPrisma(data) as any;
    const created = await this.prisma.message.create({ data: raw });
    return MessageAdapter.toDomain(created);
  }

  async list(): Promise<MessageEntity[]> {
    const rows = await this.prisma.message.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map(MessageAdapter.toDomain);
  }

  async listByChat(chatId: string): Promise<MessageEntity[]> {
    const rows = await this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map(MessageAdapter.toDomain);
  }

  async findById(id: string): Promise<MessageEntity | null> {
    const row = await this.prisma.message.findUnique({ where: { id } });
    return row ? MessageAdapter.toDomain(row) : null;
  }

  async update(data: MessageEntity): Promise<MessageEntity> {
    const exists = await this.prisma.message.findUnique({
      where: { id: data.id },
    });
    if (!exists) throw new NotFoundException('Message not found');
    const raw = MessageAdapter.toPrisma(data) as any;
    const updated = await this.prisma.message.update({
      where: { id: data.id },
      data: raw,
    });
    return MessageAdapter.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.message.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Message not found');
    await this.prisma.message.delete({ where: { id } });
  }

  async markAsRead(chatId: string, userId: string): Promise<void> {
    await this.prisma.message.updateMany({
      where: {
        chatId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });
  }
}
