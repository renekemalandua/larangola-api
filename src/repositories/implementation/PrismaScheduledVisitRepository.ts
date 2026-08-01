import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IScheduledVisitRepository } from '../IScheduledVisitRepository';
import { ScheduledVisitEntity } from '../../entities/scheduled-visit.entity';
import { ScheduledVisitAdapter } from '../../adapters/scheduled-visit.adapter';

@Injectable()
export class PrismaScheduledVisitRepository implements IScheduledVisitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: ScheduledVisitEntity): Promise<ScheduledVisitEntity> {
    const raw = ScheduledVisitAdapter.toPrisma(data) as any;
    const created = await this.prisma.scheduledVisit.create({
      data: raw,
      include: {
        property: { include: { agent: { include: { user: true } } } },
      },
    });
    const entity = ScheduledVisitAdapter.toDomain(created);
    (entity as any).property = (created as any).property;
    return entity;
  }

  async list(): Promise<ScheduledVisitEntity[]> {
    const rows = await this.prisma.scheduledVisit.findMany({
      include: {
        property: {
          include: { agent: { include: { user: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return (rows as any[]).map((row) => {
      const entity = ScheduledVisitAdapter.toDomain(row);
      (entity as any).property = row.property;
      return entity;
    });
  }

  async listByProperty(propertyId: string): Promise<ScheduledVisitEntity[]> {
    const rows = await this.prisma.scheduledVisit.findMany({
      where: { propertyId },
      include: {
        property: {
          include: { agent: { include: { user: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return (rows as any[]).map((row) => {
      const entity = ScheduledVisitAdapter.toDomain(row);
      (entity as any).property = row.property;
      return entity;
    });
  }

  async listByUser(userId: string): Promise<ScheduledVisitEntity[]> {
    const rows = await this.prisma.scheduledVisit.findMany({
      where: { userId },
      include: {
        property: {
          include: { agent: { include: { user: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return (rows as any[]).map((row) => {
      const entity = ScheduledVisitAdapter.toDomain(row);
      (entity as any).property = row.property;
      return entity;
    });
  }

  async findByUserAndProperty(
    userId: string,
    propertyId: string
  ): Promise<ScheduledVisitEntity | null> {
    const row = await this.prisma.scheduledVisit.findFirst({
      where: { userId, propertyId, status: { not: 'cancelled' } },
      include: {
        property: {
          include: { agent: { include: { user: true } } },
        },
      },
    });
    if (!row) return null;
    const entity = ScheduledVisitAdapter.toDomain(row);
    (entity as any).property = (row as any).property;
    return entity;
  }

  async findById(id: string): Promise<ScheduledVisitEntity | null> {
    const row = await this.prisma.scheduledVisit.findUnique({
      where: { id },
      include: {
        property: {
          include: { agent: { include: { user: true } } },
        },
      },
    });
    if (!row) return null;
    const entity = ScheduledVisitAdapter.toDomain(row);
    (entity as any).property = (row as any).property;
    return entity;
  }

  async update(data: ScheduledVisitEntity): Promise<ScheduledVisitEntity> {
    const exists = await this.prisma.scheduledVisit.findUnique({
      where: { id: data.id },
    });
    if (!exists) throw new NotFoundException('Scheduled visit not found');
    const raw = ScheduledVisitAdapter.toPrisma(data) as any;
    const row = await this.prisma.scheduledVisit.update({
      where: { id: data.id },
      data: raw,
      include: {
        property: { include: { agent: { include: { user: true } } } },
      },
    });
    const entity = ScheduledVisitAdapter.toDomain(row);
    (entity as any).property = (row as any).property;
    return entity;
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.scheduledVisit.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Scheduled visit not found');
    await this.prisma.scheduledVisit.delete({ where: { id } });
  }
}
