import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IPropertyRepository } from '../IPropertyRepository';
import { PropertyEntity } from '../../entities/property.entity';
import { PropertyAdapter } from '../../adapters/property.adapter';

@Injectable()
export class PrismaPropertyRepository implements IPropertyRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: PropertyEntity): Promise<PropertyEntity> {
		const raw = PropertyAdapter.toPrisma(data) as any;
		const created = await this.prisma.property.create({ data: raw });
		return PropertyAdapter.toDomain(created);
	}

	async list(): Promise<PropertyEntity[]> {
		const rows = await this.prisma.property.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(PropertyAdapter.toDomain);
	}

	async listByOwner(ownerId: string): Promise<PropertyEntity[]> {
		const rows = await this.prisma.property.findMany({ where: { ownerId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(PropertyAdapter.toDomain);
	}

	async listByCategory(categoryId: string): Promise<PropertyEntity[]> {
		const rows = await this.prisma.property.findMany({ where: { categoryId }, orderBy: { updatedAt: 'desc' } });
		return rows.map(PropertyAdapter.toDomain);
	}

	async findById(id: string): Promise<PropertyEntity | null> {
		const row = await this.prisma.property.findUnique({ where: { id } });
		return row ? PropertyAdapter.toDomain(row) : null;
	}

	async update(data: PropertyEntity): Promise<PropertyEntity> {
		const exists = await this.prisma.property.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('Property not found');
		const raw = PropertyAdapter.toPrisma(data) as any;
		const updated = await this.prisma.property.update({ where: { id: data.id }, data: raw });
		return PropertyAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.property.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Property not found');
		await this.prisma.property.delete({ where: { id } });
	}
}


