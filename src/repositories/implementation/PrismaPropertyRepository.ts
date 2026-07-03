import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../shared';
import { IPropertyRepository } from '../IPropertyRepository';
import { PropertyEntity } from '../../entities/property.entity';
import { PropertyAdapter } from '../../adapters/property.adapter';

@Injectable()
export class PrismaPropertyRepository implements IPropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly agentInclude = {
    agent: {
      include: {
        user: true,
      },
    },
  };

  private enrichProperty(row: any): PropertyEntity {
    const entity = PropertyAdapter.toDomain(row);
    (entity as any).agent = row.agent;
    return entity;
  }

  async create(data: PropertyEntity): Promise<PropertyEntity> {
    const raw = PropertyAdapter.toPrisma(data) as any;
    const created = await this.prisma.property.create({
      data: raw,
      include: this.agentInclude
    });
    return this.enrichProperty(created);
  }

  async list(): Promise<PropertyEntity[]> {
    const rows = await this.prisma.property.findMany({
      orderBy: [
        { isHighlighted: 'desc' },
        { updatedAt: 'desc' }
      ],
      include: this.agentInclude,
    });
    return rows.map((row) => this.enrichProperty(row));
  }

  async listPublished(): Promise<PropertyEntity[]> {
    const rows = await this.prisma.property.findMany({
      where: { status: 'published' },
      orderBy: [
        { isHighlighted: 'desc' },
        { createdAt: 'desc' }
      ],
      include: this.agentInclude,
    });
    return rows.map((row) => this.enrichProperty(row));
  }

  async listByAgent(agentId: string): Promise<PropertyEntity[]> {
    const rows = await this.prisma.property.findMany({
      where: { agentId },
      orderBy: [
        { isHighlighted: 'desc' },
        { updatedAt: 'desc' }
      ],
      include: this.agentInclude,
    });
    return rows.map((row) => this.enrichProperty(row));
  }

  async listByCategory(categoryId: string): Promise<PropertyEntity[]> {
    const rows = await this.prisma.property.findMany({
      where: { categoryId },
      orderBy: [
        { isHighlighted: 'desc' },
        { updatedAt: 'desc' }
      ],
      include: this.agentInclude,
    });
    return rows.map((row) => this.enrichProperty(row));
  }

  async findById(id: string): Promise<PropertyEntity | null> {
    const row = await this.prisma.property.findUnique({
      where: { id },
      include: this.agentInclude,
    });
    return row ? this.enrichProperty(row) : null;
  }

  async update(data: PropertyEntity): Promise<PropertyEntity> {
    const exists = await this.prisma.property.findUnique({
      where: { id: data.id },
    });
    if (!exists) throw new NotFoundException('Property not found');
    const raw = PropertyAdapter.toPrisma(data) as any;
    const updated = await this.prisma.property.update({
      where: { id: data.id },
      data: raw,
      include: this.agentInclude,
    });
    return this.enrichProperty(updated);
  }

  async delete(id: string): Promise<void> {
    const exists = await this.prisma.property.findUnique({ where: { id } });
    if (!exists) throw new NotFoundException('Property not found');
    await this.prisma.property.delete({ where: { id } });
  }

  async listByStatus(status: string): Promise<PropertyEntity[]> {
    const rows = await this.prisma.property.findMany({
      where: { status: status as any },
      orderBy: [
        { isHighlighted: 'desc' },
        { createdAt: 'desc' }
      ],
      include: this.agentInclude,
    });
    return rows.map((row) => this.enrichProperty(row));
  }

  async count(): Promise<number> {
    return this.prisma.property.count();
  }

  async countByStatus(status: string): Promise<number> {
    return this.prisma.property.count({ where: { status: status as any } });
  }
}
