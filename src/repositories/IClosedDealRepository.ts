import { ClosedDealEntity, AgentBankAccountEntity } from '../entities/closed-deal.entity';

export abstract class IClosedDealRepository {
  abstract create(data: ClosedDealEntity): Promise<ClosedDealEntity>;
  abstract list(): Promise<ClosedDealEntity[]>;
  abstract listByAgent(agentId: string): Promise<ClosedDealEntity[]>;
  abstract listByClient(clientId: string): Promise<ClosedDealEntity[]>;
  abstract listByProperty(propertyId: string): Promise<ClosedDealEntity[]>;
  abstract findById(id: string): Promise<ClosedDealEntity | null>;
  abstract findByPropertyAndClient(propertyId: string, clientId: string): Promise<ClosedDealEntity | null>;
  abstract listPendingFeesByAgent(agentId: string): Promise<ClosedDealEntity[]>;
  abstract listAllWithDetails(): Promise<any[]>;
  abstract update(data: ClosedDealEntity): Promise<ClosedDealEntity>;
  abstract delete(id: string): Promise<void>;
}

export abstract class IAgentBankAccountRepository {
  abstract create(data: AgentBankAccountEntity): Promise<AgentBankAccountEntity>;
  abstract listByAgent(agentId: string): Promise<AgentBankAccountEntity[]>;
  abstract findById(id: string): Promise<AgentBankAccountEntity | null>;
  abstract setFavorite(agentId: string, accountId: string): Promise<AgentBankAccountEntity>;
  abstract delete(id: string): Promise<void>;
}

