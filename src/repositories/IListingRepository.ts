import { ListingEntity } from '../entities/listing.entity';

export abstract class IListingRepository {
	abstract create(data: ListingEntity): Promise<ListingEntity>;
	abstract list(): Promise<ListingEntity[]>;
	abstract listByOwner(ownerId: string): Promise<ListingEntity[]>;
	abstract listByProperty(propertyId: string): Promise<ListingEntity[]>;
	abstract findById(id: string): Promise<ListingEntity | null>;
	abstract update(data: ListingEntity): Promise<ListingEntity>;
	abstract delete(id: string): Promise<void>;
}


