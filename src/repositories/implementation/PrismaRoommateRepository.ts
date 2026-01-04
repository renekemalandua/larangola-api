import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IRoommateRepository } from '../IRoommateRepository';
import { RoommateEntity } from '../../entities/roommate.entity';
import { RoommateAdapter } from '../../adapters/roommate.adapter';

@Injectable()
export class PrismaRoommateRepository implements IRoommateRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: RoommateEntity): Promise<RoommateEntity> {
		const raw = RoommateAdapter.toPrisma(data) as any;
		const created = await this.prisma.roommate.create({ data: raw });
		return RoommateAdapter.toDomain(created);
	}

	async list(): Promise<RoommateEntity[]> {
		const rows = await this.prisma.roommate.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(RoommateAdapter.toDomain);
	}

	async findById(id: string): Promise<RoommateEntity | null> {
		const row = await this.prisma.roommate.findUnique({ where: { id } });
		return row ? RoommateAdapter.toDomain(row) : null;
	}

	async findByUserId(userId: string): Promise<RoommateEntity | null> {
		const row = await this.prisma.roommate.findUnique({ where: { userId } });
		return row ? RoommateAdapter.toDomain(row) : null;
	}

	async update(data: RoommateEntity): Promise<RoommateEntity> {
		const exists = await this.prisma.roommate.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('Roommate not found');
		const raw = RoommateAdapter.toPrisma(data) as any;
		const updated = await this.prisma.roommate.update({ where: { id: data.id }, data: raw });
		return RoommateAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.roommate.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Roommate not found');
		await this.prisma.roommate.delete({ where: { id } });
	}
}


