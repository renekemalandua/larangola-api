import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/db-conection/prisma.service';
import { IPropertyAuditRequestRepository } from '../IPropertyAuditRequestRepository';
import { PropertyAuditRequest } from '../../entities/PropertyAuditRequest';
import { PropertyAuditRequestAdapter } from '../../adapters/property-audit-request.adapter';
import { AuditStatus } from '@prisma/client';

@Injectable()
export class PrismaPropertyAuditRequestRepository implements IPropertyAuditRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<PropertyAuditRequest, 'id' | 'createdAt' | 'updatedAt' | 'claimedByAgentId' | 'claimedAt' | 'status'>): Promise<PropertyAuditRequest> {
    const created = await this.prisma.propertyAuditRequest.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        price: data.price,
        currency: data.currency || 'AOA',
        propertyType: data.propertyType,
        listingType: data.listingType,
        images: data.images,
        notes: data.notes,
        status: AuditStatus.PENDING,
      },
    });
    return PropertyAuditRequestAdapter.fromDb(created)!;
  }

  async findById(id: string): Promise<PropertyAuditRequest | null> {
    const found = await this.prisma.propertyAuditRequest.findUnique({
      where: { id },
    });
    return PropertyAuditRequestAdapter.fromDb(found);
  }

  async findByUserId(userId: string): Promise<PropertyAuditRequest[]> {
    const requests = await this.prisma.propertyAuditRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        claimedAgent: {
          include: {
            user: {
              select: { name: true, phone: true }
            }
          }
        }
      }
    });
    return requests.map(req => PropertyAuditRequestAdapter.fromDb(req)!);
  }

  async findPending(): Promise<PropertyAuditRequest[]> {
    const requests = await this.prisma.propertyAuditRequest.findMany({
      where: { status: AuditStatus.PENDING },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        }
      }
    });
    return requests.map(req => PropertyAuditRequestAdapter.fromDb(req)!);
  }

  async findByAgentId(agentId: string): Promise<PropertyAuditRequest[]> {
    const requests = await this.prisma.propertyAuditRequest.findMany({
      where: { 
        claimedByAgentId: agentId,
        status: AuditStatus.VALIDATING
      },
      orderBy: { claimedAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        }
      }
    });
    return requests.map(req => PropertyAuditRequestAdapter.fromDb(req)!);
  }

  async updateStatus(id: string, status: AuditStatus, agentId?: string | null, notes?: string): Promise<PropertyAuditRequest> {
    const dataToUpdate: any = { status };
    if (notes) dataToUpdate.notes = notes;
    if (status === AuditStatus.VALIDATING && agentId) {
      dataToUpdate.claimedByAgentId = agentId;
      dataToUpdate.claimedAt = new Date();
    } else if (status === AuditStatus.PENDING) {
      dataToUpdate.claimedByAgentId = null;
      dataToUpdate.claimedAt = null;
    }

    const updated = await this.prisma.propertyAuditRequest.update({
      where: { id },
      data: dataToUpdate,
    });
    return PropertyAuditRequestAdapter.fromDb(updated)!;
  }

  async resetExpiredValidations(timeoutHours: number): Promise<number> {
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - timeoutHours);

    const result = await this.prisma.propertyAuditRequest.updateMany({
      where: {
        status: AuditStatus.VALIDATING,
        claimedAt: {
          lt: cutoffTime
        }
      },
      data: {
        status: AuditStatus.PENDING,
        claimedByAgentId: null,
        claimedAt: null
      }
    });

    return result.count;
  }
}
