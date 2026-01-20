import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IPropertyRequestRepository } from '../IPropertyRequestRepository';
import { PropertyRequestEntity } from '../../entities/property-request.entity';
import { PropertyRequestAdapter } from '../../adapters/property-request.adapter';

@Injectable()
export class PrismaPropertyRequestRepository implements IPropertyRequestRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: PropertyRequestEntity): Promise<PropertyRequestEntity> {
        const raw = PropertyRequestAdapter.toPrisma(data) as any;
        const created = await this.prisma.propertyRequest.create({ data: raw });
        return PropertyRequestAdapter.toDomain(created);
    }

    async list(): Promise<PropertyRequestEntity[]> {
        const rows = await this.prisma.propertyRequest.findMany({
            orderBy: { updatedAt: 'desc' },
        });
        return rows.map(PropertyRequestAdapter.toDomain);
    }

    async listByUserId(userId: string): Promise<PropertyRequestEntity[]> {
        const rows = await this.prisma.propertyRequest.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
        });
        return rows.map(PropertyRequestAdapter.toDomain);
    }

    async findById(id: string): Promise<PropertyRequestEntity | null> {
        const row = await this.prisma.propertyRequest.findUnique({ where: { id } });
        return row ? PropertyRequestAdapter.toDomain(row) : null;
    }

    async update(data: PropertyRequestEntity): Promise<PropertyRequestEntity> {
        const exists = await this.prisma.propertyRequest.findUnique({
            where: { id: data.id },
        });
        if (!exists) throw new NotFoundException('Property Request not found');
        const raw = PropertyRequestAdapter.toPrisma(data) as any;
        const updated = await this.prisma.propertyRequest.update({
            where: { id: data.id },
            data: raw,
        });
        return PropertyRequestAdapter.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        const exists = await this.prisma.propertyRequest.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException('Property Request not found');
        await this.prisma.propertyRequest.delete({ where: { id } });
    }
}
