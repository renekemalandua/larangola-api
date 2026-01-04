import { RoommateEntity } from '../entities/roommate.entity';

export abstract class IRoommateRepository {
  abstract create(data: RoommateEntity): Promise<RoommateEntity>;
  abstract list(): Promise<RoommateEntity[]>;
  abstract findById(id: string): Promise<RoommateEntity | null>;
  abstract findByUserId(userId: string): Promise<RoommateEntity | null>;
  abstract update(data: RoommateEntity): Promise<RoommateEntity>;
  abstract delete(id: string): Promise<void>;
}
