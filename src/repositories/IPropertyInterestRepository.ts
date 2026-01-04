import { PropertyInterestEntity } from '../entities/property-interest.entity';

export abstract class IPropertyInterestRepository {
  abstract create(
    data: PropertyInterestEntity
  ): Promise<PropertyInterestEntity>;
  abstract list(): Promise<PropertyInterestEntity[]>;
  abstract listByListing(listingId: string): Promise<PropertyInterestEntity[]>;
  abstract listByUser(userId: string): Promise<PropertyInterestEntity[]>;
  abstract findById(id: string): Promise<PropertyInterestEntity | null>;
  abstract update(
    data: PropertyInterestEntity
  ): Promise<PropertyInterestEntity>;
  abstract delete(id: string): Promise<void>;
}
