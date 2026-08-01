import { PropertyEntity } from '../entities/property.entity';

export abstract class IPropertyRepository {
  abstract create(data: PropertyEntity): Promise<PropertyEntity>;
  abstract list(): Promise<PropertyEntity[]>;
  abstract listPublished(): Promise<PropertyEntity[]>;
  abstract listByAgent(agentId: string): Promise<PropertyEntity[]>;
  abstract listByCategory(categoryId: string): Promise<PropertyEntity[]>;
  abstract listByStatus(status: string): Promise<PropertyEntity[]>;
  abstract findById(id: string): Promise<PropertyEntity | null>;
  abstract update(data: PropertyEntity): Promise<PropertyEntity>;
  abstract delete(id: string): Promise<void>;
  abstract count(): Promise<number>;
  abstract countByStatus(status: string): Promise<number>;
}
