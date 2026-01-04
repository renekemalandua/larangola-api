import { ScheduledVisitEntity } from '../entities/scheduled-visit.entity';

export abstract class IScheduledVisitRepository {
  abstract create(data: ScheduledVisitEntity): Promise<ScheduledVisitEntity>;
  abstract list(): Promise<ScheduledVisitEntity[]>;
  abstract listByListing(listingId: string): Promise<ScheduledVisitEntity[]>;
  abstract listByUser(userId: string): Promise<ScheduledVisitEntity[]>;
  abstract findById(id: string): Promise<ScheduledVisitEntity | null>;
  abstract update(data: ScheduledVisitEntity): Promise<ScheduledVisitEntity>;
  abstract delete(id: string): Promise<void>;
}
