import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IPropertyCategoryRepository } from '../IPropertyCategoryRepository';
import { PropertyCategoryEntity } from '../../entities/property-category.entity';
import { PropertyCategoryAdapter } from '../../adapters/property-category.adapter';

@Injectable()
export class PrismaPropertyCategoryRepository implements IPropertyCategoryRepository {
	constructor(private readonly prisma: PrismaService) { }

	async create(data: PropertyCategoryEntity): Promise<PropertyCategoryEntity> {
		const raw = PropertyCategoryAdapter.toPrisma(data) as any;
		const created = await this.prisma.propertyCategory.create({ data: raw });
		return PropertyCategoryAdapter.toDomain(created);
	}

	async list(): Promise<PropertyCategoryEntity[]> {
		const rows = await this.prisma.propertyCategory.findMany({ orderBy: { updatedAt: 'desc' } });
		return rows.map(PropertyCategoryAdapter.toDomain);
	}

	async findById(id: string): Promise<PropertyCategoryEntity | null> {
		const row = await this.prisma.propertyCategory.findUnique({ where: { id } });
		return row ? PropertyCategoryAdapter.toDomain(row) : null;
	}

	async update(data: PropertyCategoryEntity): Promise<PropertyCategoryEntity> {
		const exists = await this.prisma.propertyCategory.findUnique({ where: { id: data.id } });
		if (!exists) throw new NotFoundException('Property category not found');
		const raw = PropertyCategoryAdapter.toPrisma(data) as any;
		const updated = await this.prisma.propertyCategory.update({ where: { id: data.id }, data: raw });
		return PropertyCategoryAdapter.toDomain(updated);
	}

	async delete(id: string): Promise<void> {
		const exists = await this.prisma.propertyCategory.findUnique({ where: { id } });
		if (!exists) throw new NotFoundException('Property category not found');
		await this.prisma.propertyCategory.delete({ where: { id } });
	}
}

