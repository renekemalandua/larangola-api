import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IReviewRepository } from '../IReviewRepository';
import { ReviewEntity } from '../../entities/review.entity';
import { ReviewAdapter } from '../../adapters/review.adapter';

@Injectable()
export class PrismaReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ReviewEntity): Promise<ReviewEntity> {
    const raw = ReviewAdapter.toPrisma(data) as any;
    const created = await this.prisma.review.create({ data: raw });
    return ReviewAdapter.toDomain(created);
  }

  async list(): Promise<ReviewEntity[]> {
    const rows = await this.prisma.review.findMany({
      orderBy: { updatedAt: 'desc' },
      include: { fromUser: true },
    });
    return rows.map((row) => {
      const entity = ReviewAdapter.toDomain(row);
      (entity as any).fromUser = row.fromUser;
      return entity;
    });
  }

  async listByProperty(propertyId: string): Promise<ReviewEntity[]> {
    const rows = await this.prisma.review.findMany({
      where: { propertyId },
      orderBy: { updatedAt: 'desc' },
      include: { fromUser: true },
    });
    return rows.map((row) => {
      const entity = ReviewAdapter.toDomain(row);
      (entity as any).fromUser = row.fromUser;
      return entity;
    });
  }

  async listByToUser(toUserId: string): Promise<ReviewEntity[]> {
    const rows = await this.prisma.review.findMany({
      where: { toUserId },
      orderBy: { updatedAt: 'desc' },
      include: { fromUser: true },
    });
    return rows.map((row) => {
      const entity = ReviewAdapter.toDomain(row);
      (entity as any).fromUser = row.fromUser;
      return entity;
    });
  }

  async findById(id: string): Promise<ReviewEntity | null> {
    const row = await this.prisma.review.findUnique({
      where: { id },
      include: { fromUser: true },
    });
    if (!row) return null;
    const entity = ReviewAdapter.toDomain(row);
    (entity as any).fromUser = row.fromUser;
    return entity;
  }

  async update(data: ReviewEntity): Promise<ReviewEntity> {
    const exists = await this.prisma.review.findUnique({
      where: { id: data.id },
    });
    if (!exists) throw new NotFoundException('Review not found');
    const raw = ReviewAdapter.toPrisma(data) as any;
    const updated = await this.prisma.review.update({
      where: { id: data.id },
      data: raw,
      include: { fromUser: true },
    });
    const entity = ReviewAdapter.toDomain(updated);
    (entity as any).fromUser = updated.fromUser;
    return entity;
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.review.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Review not found');
    await this.prisma.review.delete({ where: { id } });
  }

  async findByUserIdAndRole(
    userId: string,
    role: string
  ): Promise<ReviewEntity[]> {
    const rows = await this.prisma.review.findMany({
      where: { toUserId: userId, role: role as any },
      orderBy: { updatedAt: 'desc' },
      include: { fromUser: true },
    });
    return rows.map((row) => {
      const entity = ReviewAdapter.toDomain(row);
      (entity as any).fromUser = row.fromUser;
      return entity;
    });
  }

  async countByUserIdAndRole(userId: string, role: string): Promise<number> {
    return this.prisma.review.count({
      where: { toUserId: userId, role: role as any },
    });
  }

  async findByCompositeKey(
    fromUserId: string,
    toUserId: string,
    role: string
  ): Promise<ReviewEntity | null> {
    const row = await this.prisma.review.findFirst({
      where: {
        fromUserId,
        toUserId,
        role: role as any,
      },
    });
    return row ? ReviewAdapter.toDomain(row) : null;
  }
}
