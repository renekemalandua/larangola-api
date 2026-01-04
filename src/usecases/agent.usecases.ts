import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { AgentEntity } from '../entities/agent.entity';
import { IAgentRepository } from '../repositories/IAgentRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { CreateAgentRequestDTO, UpdateAgentRequestDTO } from '../dto/agent.dto';

@Injectable()
export class CreateAgentUseCase implements UseCase<CreateAgentRequestDTO, AgentEntity> {
	constructor(
		private readonly repository: IAgentRepository,
		private readonly userRepository: IUserRepository,
	) { }
	async execute(request: CreateAgentRequestDTO): Promise<AgentEntity> {
		const user = await this.userRepository.findById(request.userId);
		if (!user) throw new BadRequestException('User does not exist');
		const existing = await this.repository.findByUserId(request.userId);
		if (existing) throw new BadRequestException('Agent already exists for this user');
		const entity = AgentEntity.create(request);
		return this.repository.create(entity);
	}
}

@Injectable()
export class UpdateAgentUseCase implements UseCase<{ id: string; data: UpdateAgentRequestDTO }, AgentEntity> {
	constructor(private readonly repository: IAgentRepository) { }
	async execute({ id, data }: { id: string; data: UpdateAgentRequestDTO }): Promise<AgentEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Agent not found');
		if (data.profession !== undefined) entity.profession = data.profession ?? null;
		if (data.company !== undefined) entity.company = data.company ?? null;
		if (data.location !== undefined) entity.location = data.location ?? null;
		if (data.bio !== undefined) entity.bio = data.bio ?? null;
		if (data.description !== undefined) entity.description = data.description ?? null;
		if (data.isVerified !== undefined) entity.isVerified = data.isVerified;
		if (data.responseRate !== undefined) entity.responseRate = data.responseRate ?? null;
		if (data.averageResponseTime !== undefined) entity.averageResponseTime = data.averageResponseTime ?? null;
		if (data.propertiesCount !== undefined) entity.propertiesCount = data.propertiesCount;
		if (data.averageRating !== undefined) entity.averageRating = data.averageRating;
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeleteAgentUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IAgentRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Agent not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListAgentsUseCase implements UseCase<void, AgentEntity[]> {
	constructor(private readonly repository: IAgentRepository) { }
	async execute(): Promise<AgentEntity[]> {
		return this.repository.list();
	}
}

@Injectable()
export class FindAgentByIdUseCase implements UseCase<string, AgentEntity | null> {
	constructor(private readonly repository: IAgentRepository) { }
	async execute(id: string): Promise<AgentEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Agent not found');
		return entity;
	}
}

@Injectable()
export class FindAgentByUserIdUseCase implements UseCase<string, AgentEntity | null> {
	constructor(private readonly repository: IAgentRepository) { }
	async execute(userId: string): Promise<AgentEntity | null> {
		const entity = await this.repository.findByUserId(userId);
		if (!entity) throw new BadRequestException('Agent not found');
		return entity;
	}
}


