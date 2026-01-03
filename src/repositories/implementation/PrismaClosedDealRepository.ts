import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IClosedDealRepository } from '../IClosedDealRepository';
import { ClosedDealEntity } from '../../entities/closed-deal.entity';
import { ClosedDealAdapter } from '../../adapters/closed-deal.adapter';

@Injectable()
export class PrismaClosedDealRepository implements IClosedDealRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: ClosedDealEntity): Promise<ClosedDealEntity> {
		const raw = ClosedDealAdapter.toPrisma(data) as any;
		const created = await this.prisma.closedDeal.create({ data: raw });
		return ClosedDealAdapter.toDomain(created);
	}

	async list(): Promise<ClosedDealEntity[]> {
		const rows = await this.prisma.closedDeal.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(ClosedDealAdapter.toDomain);
	}

	async listByAgent(agentId: string): Promise<ClosedDealEntity[]> {
		const rows = await this.prisma.closedDeal.findMany({ where: { agentId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(ClosedDealAdapter.toDomain);
	}

	async listByClient(clientId: string): Promise<ClosedDealEntity[]> {
		const rows = await this.prisma.closedDeal.findMany({ where: { clientId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(ClosedDealAdapter.toDomain);
	}

	async listByListing(listingId: string): Promise<ClosedDealEntity[]> {
		const rows = await this.prisma.closedDeal.findMany({ where: { listingId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(ClosedDealAdapter.toDomain);
	}

	async findById(id: string): Promise<ClosedDealEntity | null> {
		const row = await this.prisma.closedDeal.findUnique({ where: { id } });
		return row ? ClosedDealAdapter.toDomain(row) : null;
	}

	async update(data: ClosedDealEntity): Promise<ClosedDealEntity> {
		const exists = await this.prisma.closedDeal.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('Closed deal not found');
		const raw = ClosedDealAdapter.toPrisma(data) as any;
		const updated = await this.prisma.closedDeal.update({ where: { id: data.id }, data: raw });
		return ClosedDealAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.closedDeal.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Closed deal not found');
		await this.prisma.closedDeal.delete({ where: { id } });
	}
}

