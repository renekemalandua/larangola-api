import {
  ScheduledVisit,
  VisitStatus as VisitStatusPrisma,
} from '@prisma/client';
import {
  ScheduledVisitEntity,
  VisitStatus,
} from '../entities/scheduled-visit.entity';
import { IdValueObject } from '../shared';
import { PropertyAdapter } from './property.adapter';

export class ScheduledVisitAdapter {
  static toDomain(raw: ScheduledVisit): ScheduledVisitEntity {
    return ScheduledVisitEntity.create(
      {
        propertyId: raw.propertyId,
        userId: raw.userId,
        scheduledDate: raw.scheduledDate,
        scheduledTime: raw.scheduledTime,
        status: raw.status as VisitStatus,
        notes: raw.notes ?? null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new IdValueObject(raw.id)
    );
  }

  static toPrisma(entity: ScheduledVisitEntity): ScheduledVisit {
    return {
      id: entity.id,
      propertyId: entity.propertyId,
      userId: entity.userId,
      scheduledDate: entity.scheduledDate,
      scheduledTime: entity.scheduledTime,
      status: entity.status as VisitStatusPrisma,
      notes: entity.notes,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toHttp(entity: ScheduledVisitEntity, property?: any): any {
    const propertyData = property ? PropertyAdapter.toHttp(property, property.agent) : null;

    return {
      id: entity.id,
      propertyId: entity.propertyId,
      userId: entity.userId,
      scheduledDate: entity.scheduledDate,
      scheduledTime: entity.scheduledTime,
      status: entity.status,
      notes: entity.notes,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      property: propertyData,
    };
  }
}
