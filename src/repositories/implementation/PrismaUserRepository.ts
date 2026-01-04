import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IUserRepository } from '../IUserRepository';
import { UserEntity } from '../../entities/user.entity';
import { UserAdapter } from '../../adapters/user.adapter';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: UserEntity): Promise<UserEntity> {
    const raw = UserAdapter.toPrisma(data) as any;
    const created = await this.prisma.user.create({ data: raw });
    return UserAdapter.toDomain(created);
  }

  async list(): Promise<UserEntity[]> {
    const rows = await this.prisma.user.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(UserAdapter.toDomain);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { id } });
    return row ? UserAdapter.toDomain(row) : null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { email } });
    return row ? UserAdapter.toDomain(row) : null;
  }

  async findByPhone(phone: string): Promise<UserEntity | null> {
    const row = await this.prisma.user.findUnique({ where: { phone } });
    return row ? UserAdapter.toDomain(row) : null;
  }

  async update(data: UserEntity): Promise<UserEntity> {
    const exists = await this.prisma.user.findUnique({
      where: { id: data.id },
    });
    if (!exists) throw new NotFoundException('User not found');
    const raw = UserAdapter.toPrisma(data) as any;
    const updated = await this.prisma.user.update({
      where: { id: data.id },
      data: raw,
    });
    return UserAdapter.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.user.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id } });
  }
}
