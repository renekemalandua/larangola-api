import { UserEntity } from '../entities/user.entity';

export abstract class IUserRepository {
	abstract create(data: UserEntity): Promise<UserEntity>;
	abstract list(): Promise<UserEntity[]>;
	abstract findById(id: string): Promise<UserEntity | null>;
	abstract findByEmail(email: string): Promise<UserEntity | null>;
	abstract findByPhone(phone: string): Promise<UserEntity | null>;
	abstract update(data: UserEntity): Promise<UserEntity>;
	abstract delete(id: string): Promise<void>;
}

