import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IChatRepository } from '../IChatRepository';
import { ChatEntity } from '../../entities/chat.entity';
import { ChatAdapter } from '../../adapters/chat.adapter';

@Injectable()
export class PrismaChatRepository implements IChatRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: ChatEntity): Promise<ChatEntity> {
		const raw = ChatAdapter.toPrisma(data) as any;
		const created = await this.prisma.chat.create({ data: raw });
		return ChatAdapter.toDomain(created);
	}

	async list(): Promise<ChatEntity[]> {
		const rows = await this.prisma.chat.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(ChatAdapter.toDomain);
	}

	async findByUsers(user1Id: string, user2Id: string): Promise<ChatEntity | null> {
		const row = await this.prisma.chat.findFirst({
			where: {
				OR: [
					{ user1Id, user2Id },
					{ user1Id: user2Id, user2Id: user1Id },
				],
			},
		});
		return row ? ChatAdapter.toDomain(row) : null;
	}

	async listByUser(userId: string): Promise<ChatEntity[]> {
		const rows = await this.prisma.chat.findMany({
			where: {
				OR: [{ user1Id: userId }, { user2Id: userId }],
			},
			orderBy: { updatedAt: 'desc' },
		});
		return rows.map(ChatAdapter.toDomain);
	}

	async findById(id: string): Promise<ChatEntity | null> {
		const row = await this.prisma.chat.findUnique({ where: { id } });
		return row ? ChatAdapter.toDomain(row) : null;
	}

	async update(data: ChatEntity): Promise<ChatEntity> {
		const exists = await this.prisma.chat.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('Chat not found');
		const raw = ChatAdapter.toPrisma(data) as any;
		const updated = await this.prisma.chat.update({ where: { id: data.id }, data: raw });
		return ChatAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.chat.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Chat not found');
		await this.prisma.chat.delete({ where: { id } });
	}
}

