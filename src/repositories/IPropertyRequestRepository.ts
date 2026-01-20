import { PropertyRequestEntity } from '../entities/property-request.entity';

export abstract class IPropertyRequestRepository {
  abstract create(data: PropertyRequestEntity): Promise<PropertyRequestEntity>;
  abstract list(): Promise<PropertyRequestEntity[]>;
  abstract listByUserId(userId: string): Promise<PropertyRequestEntity[]>;
  abstract findById(id: string): Promise<PropertyRequestEntity | null>;
  abstract update(data: PropertyRequestEntity): Promise<PropertyRequestEntity>;
  abstract delete(id: string): Promise<void>;
}
