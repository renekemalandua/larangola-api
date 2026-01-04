import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { MessageEntity } from '../entities/message.entity';
import { IMessageRepository } from '../repositories/IMessageRepository';
import { IChatRepository } from '../repositories/IChatRepository';
import { CreateMessageRequestDTO, UpdateMessageRequestDTO } from '../dto/message.dto';

@Injectable()
export class CreateMessageUseCase implements UseCase<CreateMessageRequestDTO, MessageEntity> {
	constructor(
		private readonly repository: IMessageRepository,
		private readonly chatRepository: IChatRepository,
	) { }
	async execute(request: CreateMessageRequestDTO): Promise<MessageEntity> {
		const chat = await this.chatRepository.findById(request.chatId);
		if (!chat) throw new BadRequestException('Chat does not exist');

		// Verify sender is part of the chat
		if (chat.user1Id !== request.senderId && chat.user2Id !== request.senderId) {
			throw new BadRequestException('Sender is not part of this chat');
		}

		const entity = MessageEntity.create(request);
		const created = await this.repository.create(entity);

		// Update chat last message
		chat.lastMessage = request.text;
		chat.lastMessageTime = new Date();
		if (chat.user1Id === request.senderId) {
			chat.unreadCountUser2 += 1;
		} else {
			chat.unreadCountUser1 += 1;
		}
		await this.chatRepository.update(chat);

		return created;
	}
}

@Injectable()
export class UpdateMessageUseCase implements UseCase<{ id: string; data: UpdateMessageRequestDTO }, MessageEntity> {
	constructor(private readonly repository: IMessageRepository) { }
	async execute({ id, data }: { id: string; data: UpdateMessageRequestDTO }): Promise<MessageEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Message not found');
		if (data.isRead !== undefined) entity.isRead = data.isRead;
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeleteMessageUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IMessageRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Message not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListMessagesUseCase implements UseCase<void, MessageEntity[]> {
	constructor(private readonly repository: IMessageRepository) { }
	async execute(): Promise<MessageEntity[]> {
		return this.repository.list();
	}
}

@Injectable()
export class ListMessagesByChatUseCase implements UseCase<string, MessageEntity[]> {
	constructor(private readonly repository: IMessageRepository) { }
	async execute(chatId: string): Promise<MessageEntity[]> {
		return this.repository.listByChat(chatId);
	}
}

@Injectable()
export class FindMessageByIdUseCase implements UseCase<string, MessageEntity | null> {
	constructor(private readonly repository: IMessageRepository) { }
	async execute(id: string): Promise<MessageEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Message not found');
		return entity;
	}
}

@Injectable()
export class MarkMessagesAsReadUseCase implements UseCase<{ chatId: string; userId: string }, void> {
	constructor(private readonly repository: IMessageRepository) { }
	async execute({ chatId, userId }: { chatId: string; userId: string }): Promise<void> {
		await this.repository.markAsRead(chatId, userId);
	}
}


