import { AgentSubscriptionEntity } from '../entities/agent-subscription.entity';

export abstract class IAgentSubscriptionRepository {
  abstract create(
    data: AgentSubscriptionEntity
  ): Promise<AgentSubscriptionEntity>;
  abstract list(): Promise<AgentSubscriptionEntity[]>;
  abstract listByAgent(agentId: string): Promise<AgentSubscriptionEntity[]>;
  abstract findById(id: string): Promise<AgentSubscriptionEntity | null>;
  abstract update(
    data: AgentSubscriptionEntity
  ): Promise<AgentSubscriptionEntity>;
  abstract delete(id: string): Promise<void>;
}
