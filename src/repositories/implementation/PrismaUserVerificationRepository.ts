import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IUserVerificationRepository } from '../IUserVerificationRepository';
import { UserVerificationEntity } from '../../entities/user-verification.entity';
import { UserVerificationAdapter } from '../../adapters/user-verification.adapter';

@Injectable()
export class PrismaUserVerificationRepository implements IUserVerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: UserVerificationEntity): Promise<UserVerificationEntity> {
    const raw = UserVerificationAdapter.toPrisma(data);
    const created = await this.prisma.userVerification.create({ data: raw });
    return UserVerificationAdapter.toDomain(created);
  }

  async findById(id: string): Promise<UserVerificationEntity | null> {
    const row = await this.prisma.userVerification.findUnique({
      where: { id },
    });
    return row ? UserVerificationAdapter.toDomain(row) : null;
  }

  async findByUserId(userId: string): Promise<UserVerificationEntity | null> {
    const row = await this.prisma.userVerification.findUnique({
      where: { userId },
    });
    return row ? UserVerificationAdapter.toDomain(row) : null;
  }

  async update(data: UserVerificationEntity): Promise<UserVerificationEntity> {
    const exists = await this.prisma.userVerification.findUnique({
      where: { id: data.id },
    });
    if (!exists) throw new NotFoundException('User verification not found');
    const raw = UserVerificationAdapter.toPrisma(data);
    await this.prisma.userVerification.update({
      where: { id: data.id },
      data: raw,
    });
    return data;
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.userVerification.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('User verification not found');
    await this.prisma.userVerification.delete({ where: { id } });
  }
}
