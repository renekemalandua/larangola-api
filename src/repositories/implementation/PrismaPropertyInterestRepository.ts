import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IPropertyInterestRepository } from '../IPropertyInterestRepository';
import { PropertyInterestEntity } from '../../entities/property-interest.entity';
import { PropertyInterestAdapter } from '../../adapters/property-interest.adapter';

@Injectable()
export class PrismaPropertyInterestRepository implements IPropertyInterestRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: PropertyInterestEntity): Promise<PropertyInterestEntity> {
		const raw = PropertyInterestAdapter.toPrisma(data) as any;
		const created = await this.prisma.propertyInterest.create({ data: raw });
		return PropertyInterestAdapter.toDomain(created);
	}

	async list(): Promise<PropertyInterestEntity[]> {
		const rows = await this.prisma.propertyInterest.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(PropertyInterestAdapter.toDomain);
	}

	async listByListing(listingId: string): Promise<PropertyInterestEntity[]> {
		const rows = await this.prisma.propertyInterest.findMany({ where: { listingId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(PropertyInterestAdapter.toDomain);
	}

	async listByUser(userId: string): Promise<PropertyInterestEntity[]> {
		const rows = await this.prisma.propertyInterest.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(PropertyInterestAdapter.toDomain);
	}

	async findById(id: string): Promise<PropertyInterestEntity | null> {
		const row = await this.prisma.propertyInterest.findUnique({ where: { id } });
		return row ? PropertyInterestAdapter.toDomain(row) : null;
	}

	async update(data: PropertyInterestEntity): Promise<PropertyInterestEntity> {
		const exists = await this.prisma.propertyInterest.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('Property interest not found');
		const raw = PropertyInterestAdapter.toPrisma(data) as any;
		const updated = await this.prisma.propertyInterest.update({ where: { id: data.id }, data: raw });
		return PropertyInterestAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.propertyInterest.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Property interest not found');
		await this.prisma.propertyInterest.delete({ where: { id } });
	}
}


