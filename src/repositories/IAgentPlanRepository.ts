import { AgentPlanEntity } from '../entities/agent-plan.entity';

export abstract class IAgentPlanRepository {
	abstract create(data: AgentPlanEntity): Promise<AgentPlanEntity>;
	abstract list(): Promise<AgentPlanEntity[]>;
	abstract findById(id: string): Promise<AgentPlanEntity | null>;
	abstract update(data: AgentPlanEntity): Promise<AgentPlanEntity>;
	abstract delete(id: string): Promise<void>;
}


