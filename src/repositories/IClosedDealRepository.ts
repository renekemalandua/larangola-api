import { ClosedDealEntity } from '../entities/closed-deal.entity';

export abstract class IClosedDealRepository {
  abstract create(data: ClosedDealEntity): Promise<ClosedDealEntity>;
  abstract list(): Promise<ClosedDealEntity[]>;
  abstract listByAgent(agentId: string): Promise<ClosedDealEntity[]>;
  abstract listByClient(clientId: string): Promise<ClosedDealEntity[]>;
  abstract listByListing(listingId: string): Promise<ClosedDealEntity[]>;
  abstract findById(id: string): Promise<ClosedDealEntity | null>;
  abstract update(data: ClosedDealEntity): Promise<ClosedDealEntity>;
  abstract delete(id: string): Promise<void>;
}
