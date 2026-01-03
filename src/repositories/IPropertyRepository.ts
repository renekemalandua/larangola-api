import { PropertyEntity } from '../entities/property.entity';

export abstract class IPropertyRepository {
	abstract create(data: PropertyEntity): Promise<PropertyEntity>;
	abstract list(): Promise<PropertyEntity[]>;
	abstract listByOwner(ownerId: string): Promise<PropertyEntity[]>;
	abstract listByCategory(categoryId: string): Promise<PropertyEntity[]>;
	abstract findById(id: string): Promise<PropertyEntity | null>;
	abstract update(data: PropertyEntity): Promise<PropertyEntity>;
	abstract delete(id: string): Promise<void>;
}

