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
    workspaceDetails: true,
    _count: {
      select: {
        scheduledVisits: true,
        propertyInterests: true,
      }
    }
  };

  private enrichProperty(row: any): PropertyEntity {
    const interactionCount = row._count 
      ? (row._count.scheduledVisits || 0) + (row._count.propertyInterests || 0) 
      : null;
      
    const entity = PropertyAdapter.toDomain({
      ...row,
      interactionCount
    });
    (entity as any).agent = row.agent;
    return entity;
  }

  async create(data: PropertyEntity): Promise<PropertyEntity> {
    const raw = PropertyAdapter.toPrisma(data) as any;
    const workspaceData = (data as any).workspaceDetails;

    const createPayload: any = {
      ...raw,
    };

    if (workspaceData) {
      createPayload.workspaceDetails = {
        create: {
          workspaceType: workspaceData.workspaceType,
          pricingType: workspaceData.pricingType ?? 'BOTH',
          pricePerHour: workspaceData.pricePerHour ? Number(workspaceData.pricePerHour) : null,
          pricePerDay: workspaceData.pricePerDay ? Number(workspaceData.pricePerDay) : null,
          capacitySeats: Number(workspaceData.capacitySeats || 1),
          minBookingHours: Number(workspaceData.minBookingHours || 1),
          hasHighSpeedWifi: workspaceData.hasHighSpeedWifi !== undefined ? !!workspaceData.hasHighSpeedWifi : true,
          hasGenerator: workspaceData.hasGenerator !== undefined ? !!workspaceData.hasGenerator : true,
          hasProjector: !!workspaceData.hasProjector,
          hasWhiteboard: !!workspaceData.hasWhiteboard,
          hasAirConditioning: workspaceData.hasAirConditioning !== undefined ? !!workspaceData.hasAirConditioning : true,
          hasCoffeeBreak: !!workspaceData.hasCoffeeBreak,
          hasParking: !!workspaceData.hasParking,
        },
      };
    }

    const created = await this.prisma.property.create({
      data: createPayload,
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
    const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
    const rows = await this.prisma.property.findMany({
      where: { 
        OR: [
          { status: 'published' },
          { 
            status: 'finished',
            statusUpdatedAt: { gte: seventyTwoHoursAgo }
          }
        ]
      },
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
      include: { workspaceDetails: true },
    });
    if (!exists) throw new NotFoundException('Property not found');
    const raw = PropertyAdapter.toPrisma(data) as any;
    const workspaceData = (data as any).workspaceDetails;

    const updatePayload: any = {
      ...raw,
    };

    if (workspaceData) {
      updatePayload.workspaceDetails = {
        upsert: {
          create: {
            workspaceType: workspaceData.workspaceType,
            pricingType: workspaceData.pricingType ?? 'BOTH',
            pricePerHour: workspaceData.pricePerHour ? Number(workspaceData.pricePerHour) : null,
            pricePerDay: workspaceData.pricePerDay ? Number(workspaceData.pricePerDay) : null,
            capacitySeats: Number(workspaceData.capacitySeats || 1),
            minBookingHours: Number(workspaceData.minBookingHours || 1),
            hasHighSpeedWifi: workspaceData.hasHighSpeedWifi !== undefined ? !!workspaceData.hasHighSpeedWifi : true,
            hasGenerator: workspaceData.hasGenerator !== undefined ? !!workspaceData.hasGenerator : true,
            hasProjector: !!workspaceData.hasProjector,
            hasWhiteboard: !!workspaceData.hasWhiteboard,
            hasAirConditioning: workspaceData.hasAirConditioning !== undefined ? !!workspaceData.hasAirConditioning : true,
            hasCoffeeBreak: !!workspaceData.hasCoffeeBreak,
            hasParking: !!workspaceData.hasParking,
          },
          update: {
            workspaceType: workspaceData.workspaceType,
            pricingType: workspaceData.pricingType ?? 'BOTH',
            pricePerHour: workspaceData.pricePerHour ? Number(workspaceData.pricePerHour) : null,
            pricePerDay: workspaceData.pricePerDay ? Number(workspaceData.pricePerDay) : null,
            capacitySeats: Number(workspaceData.capacitySeats || 1),
            minBookingHours: Number(workspaceData.minBookingHours || 1),
            hasHighSpeedWifi: workspaceData.hasHighSpeedWifi !== undefined ? !!workspaceData.hasHighSpeedWifi : true,
            hasGenerator: workspaceData.hasGenerator !== undefined ? !!workspaceData.hasGenerator : true,
            hasProjector: !!workspaceData.hasProjector,
            hasWhiteboard: !!workspaceData.hasWhiteboard,
            hasAirConditioning: workspaceData.hasAirConditioning !== undefined ? !!workspaceData.hasAirConditioning : true,
            hasCoffeeBreak: !!workspaceData.hasCoffeeBreak,
            hasParking: !!workspaceData.hasParking,
          },
        },
      };
    }

    const updated = await this.prisma.property.update({
      where: { id: data.id },
      data: updatePayload,
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

  async listWorkspaces(filters?: any): Promise<PropertyEntity[]> {
    const where: any = {
      workspaceDetails: { isNot: null },
      status: 'published',
    };

    if (filters?.workspaceType) {
      where.workspaceDetails = {
        ...where.workspaceDetails,
        workspaceType: filters.workspaceType,
      };
    }

    if (filters?.city) {
      where.city = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters?.minCapacity) {
      where.workspaceDetails = {
        ...where.workspaceDetails,
        capacitySeats: { gte: Number(filters.minCapacity) },
      };
    }

    if (filters?.maxPricePerHour) {
      where.workspaceDetails = {
        ...where.workspaceDetails,
        pricePerHour: { lte: Number(filters.maxPricePerHour) },
      };
    }

    if (filters?.maxPricePerDay) {
      where.workspaceDetails = {
        ...where.workspaceDetails,
        pricePerDay: { lte: Number(filters.maxPricePerDay) },
      };
    }

    const rows = await this.prisma.property.findMany({
      where,
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
