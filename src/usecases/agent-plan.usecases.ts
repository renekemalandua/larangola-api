import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { AgentPlanEntity } from '../entities/agent-plan.entity';
import { IAgentPlanRepository } from '../repositories/IAgentPlanRepository';
import {
  CreateAgentPlanRequestDTO,
  UpdateAgentPlanRequestDTO,
} from '../dto/agent-plan.dto';

@Injectable()
export class CreateAgentPlanUseCase implements UseCase<
  CreateAgentPlanRequestDTO,
  AgentPlanEntity
> {
  constructor(private readonly repository: IAgentPlanRepository) {}
  async execute(request: CreateAgentPlanRequestDTO): Promise<AgentPlanEntity> {
    const entity = AgentPlanEntity.create(request);
    return this.repository.create(entity);
  }
}

@Injectable()
export class UpdateAgentPlanUseCase implements UseCase<
  { id: string; data: UpdateAgentPlanRequestDTO },
  AgentPlanEntity
> {
  constructor(private readonly repository: IAgentPlanRepository) {}
  async execute({
    id,
    data,
  }: {
    id: string;
    data: UpdateAgentPlanRequestDTO;
  }): Promise<AgentPlanEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Agent plan not found');
    if (data.name !== undefined) entity.name = data.name;
    if (data.price !== undefined) entity.price = data.price;
    if (data.pricePeriod !== undefined)
      entity.pricePeriod = data.pricePeriod ?? null;
    if (data.description !== undefined)
      entity.description = data.description ?? null;
    if (data.features !== undefined) entity.features = data.features ?? null;
    if (data.isPopular !== undefined) entity.isPopular = data.isPopular;
    if (data.badge !== undefined) entity.badge = data.badge ?? null;
    return this.repository.update(entity);
  }
}

@Injectable()
export class DeleteAgentPlanUseCase implements UseCase<string, void> {
  constructor(private readonly repository: IAgentPlanRepository) {}
  async execute(id: string): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Agent plan not found');
    await this.repository.delete(id);
  }
}

@Injectable()
export class ListAgentPlansUseCase implements UseCase<void, AgentPlanEntity[]> {
  constructor(private readonly repository: IAgentPlanRepository) {}
  async execute(): Promise<AgentPlanEntity[]> {
    return this.repository.list();
  }
}

@Injectable()
export class FindAgentPlanByIdUseCase implements UseCase<
  string,
  AgentPlanEntity | null
> {
  constructor(private readonly repository: IAgentPlanRepository) {}
  async execute(id: string): Promise<AgentPlanEntity | null> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Agent plan not found');
    return entity;
  }
}
