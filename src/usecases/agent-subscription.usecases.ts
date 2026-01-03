import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { AgentSubscriptionEntity } from '../entities/agent-subscription.entity';
import { IAgentSubscriptionRepository } from '../repositories/IAgentSubscriptionRepository';
import { IAgentRepository } from '../repositories/IAgentRepository';
import { IAgentPlanRepository } from '../repositories/IAgentPlanRepository';
import { CreateAgentSubscriptionRequestDTO, UpdateAgentSubscriptionRequestDTO } from '../dto/agent-subscription.dto';

@Injectable()
export class CreateAgentSubscriptionUseCase implements UseCase<CreateAgentSubscriptionRequestDTO, AgentSubscriptionEntity> {
	constructor(
		private readonly repository: IAgentSubscriptionRepository,
		private readonly agentRepository: IAgentRepository,
		private readonly planRepository: IAgentPlanRepository,
	) { }
	async execute(request: CreateAgentSubscriptionRequestDTO): Promise<AgentSubscriptionEntity> {
		const agent = await this.agentRepository.findById(request.agentId);
		if (!agent) throw new BadRequestException('Agent does not exist');
		const plan = await this.planRepository.findById(request.planId);
		if (!plan) throw new BadRequestException('Agent plan does not exist');
		const entity = AgentSubscriptionEntity.create({
			...request,
			startDate: new Date(request.startDate),
			endDate: request.endDate ? new Date(request.endDate) : null,
		});
		return this.repository.create(entity);
	}
}

@Injectable()
export class UpdateAgentSubscriptionUseCase implements UseCase<{ id: string; data: UpdateAgentSubscriptionRequestDTO }, AgentSubscriptionEntity> {
	constructor(private readonly repository: IAgentSubscriptionRepository) { }
	async execute({ id, data }: { id: string; data: UpdateAgentSubscriptionRequestDTO }): Promise<AgentSubscriptionEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Agent subscription not found');
		if (data.endDate !== undefined) entity.endDate = data.endDate ? new Date(data.endDate) : null;
		if (data.status !== undefined) entity.status = data.status;
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeleteAgentSubscriptionUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IAgentSubscriptionRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Agent subscription not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListAgentSubscriptionsUseCase implements UseCase<void, AgentSubscriptionEntity[]> {
	constructor(private readonly repository: IAgentSubscriptionRepository) { }
	async execute(): Promise<AgentSubscriptionEntity[]> {
		return this.repository.list();
	}
}

@Injectable()
export class ListAgentSubscriptionsByAgentUseCase implements UseCase<string, AgentSubscriptionEntity[]> {
	constructor(private readonly repository: IAgentSubscriptionRepository) { }
	async execute(agentId: string): Promise<AgentSubscriptionEntity[]> {
		return this.repository.listByAgent(agentId);
	}
}

@Injectable()
export class FindAgentSubscriptionByIdUseCase implements UseCase<string, AgentSubscriptionEntity | null> {
	constructor(private readonly repository: IAgentSubscriptionRepository) { }
	async execute(id: string): Promise<AgentSubscriptionEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Agent subscription not found');
		return entity;
	}
}

