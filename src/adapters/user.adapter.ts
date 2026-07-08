import { User } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';
import { IdValueObject } from '../shared';

export class UserAdapter {
  static toDomain(raw: User): UserEntity {
    return UserEntity.create(
      {
        email: raw.email,
        phone: raw.phone,
        password: raw.password,
        name: raw.name,
        avatar: (raw as any).avatar ?? null,
        isActive: (raw as any).isActive,
        adminRole: (raw as any).adminRole ?? 'NONE',
        agent: (raw as any).agent,
        roommate: (raw as any).roommate,
        createdAt: (raw as any).createdAt,
        updatedAt: (raw as any).updatedAt,
        resetOtpCode: (raw as any).resetOtpCode,
        resetOtpExpiresAt: (raw as any).resetOtpExpiresAt,
      },
      new IdValueObject((raw as any).id)
    );
  }

  static toPrisma(entity: UserEntity): User {
    return {
      id: entity.id,
      email: entity.email,
      phone: entity.phone,
      password: entity.password,
      name: entity.name,
      avatar: entity.avatar,
      isActive: entity.isActive,
      adminRole: entity.adminRole as any,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      resetOtpCode: entity.resetOtpCode,
      resetOtpExpiresAt: entity.resetOtpExpiresAt,
    };
  }

  static toHttp(entity: UserEntity): any {
    return {
      id: entity.id,
      email: entity.email,
      phone: entity.phone,
      name: entity.name,
      avatar: entity.avatar,
      isActive: entity.isActive,
      adminRole: entity.adminRole,
      agent: entity.agent,
      roommate: entity.roommate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
