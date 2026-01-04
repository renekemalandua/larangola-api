import { ChatEntity } from '../entities/chat.entity';

export abstract class IChatRepository {
	abstract create(data: ChatEntity): Promise<ChatEntity>;
	abstract list(): Promise<ChatEntity[]>;
	abstract findByUsers(user1Id: string, user2Id: string): Promise<ChatEntity | null>;
	abstract listByUser(userId: string): Promise<ChatEntity[]>;
	abstract findById(id: string): Promise<ChatEntity | null>;
	abstract update(data: ChatEntity): Promise<ChatEntity>;
	abstract delete(id: string): Promise<void>;
}


