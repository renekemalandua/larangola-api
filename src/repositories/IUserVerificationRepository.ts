import { UserVerificationEntity } from '../entities/user-verification.entity';

export abstract class IUserVerificationRepository {
  abstract create(
    entity: UserVerificationEntity
  ): Promise<UserVerificationEntity>;
  abstract update(
    entity: UserVerificationEntity
  ): Promise<UserVerificationEntity>;
  abstract findById(id: string): Promise<UserVerificationEntity | null>;
  abstract findByUserId(userId: string): Promise<UserVerificationEntity | null>;
  abstract delete(id: string): Promise<void>;
}
