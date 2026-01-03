import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { ClosedDealEntity } from '../entities/closed-deal.entity';
import { IClosedDealRepository } from '../repositories/IClosedDealRepository';
import { IListingRepository } from '../repositories/IListingRepository';
import { IAgentRepository } from '../repositories/IAgentRepository';
import { CreateClosedDealRequestDTO, UpdateClosedDealRequestDTO } from '../dto/closed-deal.dto';

@Injectable()
export class CreateClosedDealUseCase implements UseCase<CreateClosedDealRequestDTO, ClosedDealEntity> {
	constructor(
		private readonly repository: IClosedDealRepository,
		private readonly listingRepository: IListingRepository,
		private readonly agentRepository: IAgentRepository,
	) { }
	async execute(request: CreateClosedDealRequestDTO): Promise<ClosedDealEntity> {
		const listing = await this.listingRepository.findById(request.listingId);
		if (!listing) throw new BadRequestException('Listing does not exist');
		const agent = await this.agentRepository.findById(request.agentId);
		if (!agent) throw new BadRequestException('Agent does not exist');
		const entity = ClosedDealEntity.create({
			...request,
			closedDate: new Date(request.closedDate),
		});
		return this.repository.create(entity);
	}
}

@Injectable()
export class UpdateClosedDealUseCase implements UseCase<{ id: string; data: UpdateClosedDealRequestDTO }, ClosedDealEntity> {
	constructor(private readonly repository: IClosedDealRepository) { }
	async execute({ id, data }: { id: string; data: UpdateClosedDealRequestDTO }): Promise<ClosedDealEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Closed deal not found');
		if (data.commissionAmount !== undefined) entity.commissionAmount = data.commissionAmount;
		if (data.commissionRate !== undefined) entity.commissionRate = data.commissionRate;
		if (data.status !== undefined) entity.status = data.status;
		if (data.closedDate !== undefined) entity.closedDate = new Date(data.closedDate);
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeleteClosedDealUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IClosedDealRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Closed deal not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListClosedDealsUseCase implements UseCase<void, ClosedDealEntity[]> {
	constructor(private readonly repository: IClosedDealRepository) { }
	async execute(): Promise<ClosedDealEntity[]> {
		return this.repository.list();
	}
}

@Injectable()
export class ListClosedDealsByAgentUseCase implements UseCase<string, ClosedDealEntity[]> {
	constructor(private readonly repository: IClosedDealRepository) { }
	async execute(agentId: string): Promise<ClosedDealEntity[]> {
		return this.repository.listByAgent(agentId);
	}
}

@Injectable()
export class ListClosedDealsByClientUseCase implements UseCase<string, ClosedDealEntity[]> {
	constructor(private readonly repository: IClosedDealRepository) { }
	async execute(clientId: string): Promise<ClosedDealEntity[]> {
		return this.repository.listByClient(clientId);
	}
}

@Injectable()
export class FindClosedDealByIdUseCase implements UseCase<string, ClosedDealEntity | null> {
	constructor(private readonly repository: IClosedDealRepository) { }
	async execute(id: string): Promise<ClosedDealEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Closed deal not found');
		return entity;
	}
}

