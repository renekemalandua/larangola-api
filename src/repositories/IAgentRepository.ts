import { AgentEntity } from '../entities/agent.entity';

export abstract class IAgentRepository {
	abstract create(data: AgentEntity): Promise<AgentEntity>;
	abstract list(): Promise<AgentEntity[]>;
	abstract findById(id: string): Promise<AgentEntity | null>;
	abstract findByUserId(userId: string): Promise<AgentEntity | null>;
	abstract update(data: AgentEntity): Promise<AgentEntity>;
	abstract delete(id: string): Promise<void>;
}

