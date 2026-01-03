import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IReviewRepository } from '../IReviewRepository';
import { ReviewEntity } from '../../entities/review.entity';
import { ReviewAdapter } from '../../adapters/review.adapter';

@Injectable()
export class PrismaReviewRepository implements IReviewRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: ReviewEntity): Promise<ReviewEntity> {
		const raw = ReviewAdapter.toPrisma(data) as any;
		const created = await this.prisma.review.create({ data: raw });
		return ReviewAdapter.toDomain(created);
	}

	async list(): Promise<ReviewEntity[]> {
		const rows = await this.prisma.review.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(ReviewAdapter.toDomain);
	}

	async listByListing(listingId: string): Promise<ReviewEntity[]> {
		const rows = await this.prisma.review.findMany({ where: { listingId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(ReviewAdapter.toDomain);
	}

	async listByToUser(toUserId: string): Promise<ReviewEntity[]> {
		const rows = await this.prisma.review.findMany({ where: { toUserId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(ReviewAdapter.toDomain);
	}

	async findById(id: string): Promise<ReviewEntity | null> {
		const row = await this.prisma.review.findUnique({ where: { id } });
		return row ? ReviewAdapter.toDomain(row) : null;
	}

	async update(data: ReviewEntity): Promise<ReviewEntity> {
		const exists = await this.prisma.review.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('Review not found');
		const raw = ReviewAdapter.toPrisma(data) as any;
		const updated = await this.prisma.review.update({ where: { id: data.id }, data: raw });
		return ReviewAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.review.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Review not found');
		await this.prisma.review.delete({ where: { id } });
	}
}

