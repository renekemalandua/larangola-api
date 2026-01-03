import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { ChatEntity } from '../entities/chat.entity';
import { IChatRepository } from '../repositories/IChatRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { CreateChatRequestDTO, UpdateChatRequestDTO } from '../dto/chat.dto';

@Injectable()
export class CreateChatUseCase implements UseCase<CreateChatRequestDTO, ChatEntity> {
	constructor(
		private readonly repository: IChatRepository,
		private readonly userRepository: IUserRepository,
	) { }
	async execute(request: CreateChatRequestDTO): Promise<ChatEntity> {
		if (request.user1Id === request.user2Id) {
			throw new BadRequestException('User cannot chat with themselves');
		}
		const user1 = await this.userRepository.findById(request.user1Id);
		if (!user1) throw new BadRequestException('User1 does not exist');
		const user2 = await this.userRepository.findById(request.user2Id);
		if (!user2) throw new BadRequestException('User2 does not exist');

		// Check if chat already exists
		const existing = await this.repository.findByUsers(request.user1Id, request.user2Id);
		if (existing) throw new BadRequestException('Chat already exists between these users');

		const entity = ChatEntity.create(request);
		return this.repository.create(entity);
	}
}

@Injectable()
export class UpdateChatUseCase implements UseCase<{ id: string; data: UpdateChatRequestDTO }, ChatEntity> {
	constructor(private readonly repository: IChatRepository) { }
	async execute({ id, data }: { id: string; data: UpdateChatRequestDTO }): Promise<ChatEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Chat not found');
		if (data.lastMessage !== undefined) entity.lastMessage = data.lastMessage ?? null;
		if (data.isBlocked !== undefined) entity.isBlocked = data.isBlocked;
		if (data.unreadCountUser1 !== undefined) entity.unreadCountUser1 = data.unreadCountUser1;
		if (data.unreadCountUser2 !== undefined) entity.unreadCountUser2 = data.unreadCountUser2;
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeleteChatUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IChatRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Chat not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListChatsUseCase implements UseCase<void, ChatEntity[]> {
	constructor(private readonly repository: IChatRepository) { }
	async execute(): Promise<ChatEntity[]> {
		return this.repository.list();
	}
}

@Injectable()
export class ListChatsByUserUseCase implements UseCase<string, ChatEntity[]> {
	constructor(private readonly repository: IChatRepository) { }
	async execute(userId: string): Promise<ChatEntity[]> {
		return this.repository.listByUser(userId);
	}
}

@Injectable()
export class FindChatByIdUseCase implements UseCase<string, ChatEntity | null> {
	constructor(private readonly repository: IChatRepository) { }
	async execute(id: string): Promise<ChatEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Chat not found');
		return entity;
	}
}

@Injectable()
export class FindChatByUsersUseCase implements UseCase<{ user1Id: string; user2Id: string }, ChatEntity | null> {
	constructor(private readonly repository: IChatRepository) { }
	async execute({ user1Id, user2Id }: { user1Id: string; user2Id: string }): Promise<ChatEntity | null> {
		const entity = await this.repository.findByUsers(user1Id, user2Id);
		if (!entity) throw new BadRequestException('Chat not found');
		return entity;
	}
}

