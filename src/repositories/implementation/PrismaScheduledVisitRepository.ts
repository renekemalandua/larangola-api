import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IScheduledVisitRepository } from '../IScheduledVisitRepository';
import { ScheduledVisitEntity } from '../../entities/scheduled-visit.entity';
import { ScheduledVisitAdapter } from '../../adapters/scheduled-visit.adapter';

@Injectable()
export class PrismaScheduledVisitRepository implements IScheduledVisitRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: ScheduledVisitEntity): Promise<ScheduledVisitEntity> {
		const raw = ScheduledVisitAdapter.toPrisma(data) as any;
		const created = await this.prisma.scheduledVisit.create({ data: raw });
		return ScheduledVisitAdapter.toDomain(created);
	}

	async list(): Promise<ScheduledVisitEntity[]> {
		const rows = await this.prisma.scheduledVisit.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(ScheduledVisitAdapter.toDomain);
	}

	async listByListing(listingId: string): Promise<ScheduledVisitEntity[]> {
		const rows = await this.prisma.scheduledVisit.findMany({ where: { listingId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(ScheduledVisitAdapter.toDomain);
	}

	async listByUser(userId: string): Promise<ScheduledVisitEntity[]> {
		const rows = await this.prisma.scheduledVisit.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(ScheduledVisitAdapter.toDomain);
	}

	async findById(id: string): Promise<ScheduledVisitEntity | null> {
		const row = await this.prisma.scheduledVisit.findUnique({ where: { id } });
		return row ? ScheduledVisitAdapter.toDomain(row) : null;
	}

	async update(data: ScheduledVisitEntity): Promise<ScheduledVisitEntity> {
		const exists = await this.prisma.scheduledVisit.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('Scheduled visit not found');
		const raw = ScheduledVisitAdapter.toPrisma(data) as any;
		const updated = await this.prisma.scheduledVisit.update({ where: { id: data.id }, data: raw });
		return ScheduledVisitAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.scheduledVisit.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Scheduled visit not found');
		await this.prisma.scheduledVisit.delete({ where: { id } });
	}
}


