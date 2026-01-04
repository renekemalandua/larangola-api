import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { ScheduledVisitEntity } from '../entities/scheduled-visit.entity';
import { IScheduledVisitRepository } from '../repositories/IScheduledVisitRepository';
import { IListingRepository } from '../repositories/IListingRepository';
import { CreateScheduledVisitRequestDTO, UpdateScheduledVisitRequestDTO } from '../dto/scheduled-visit.dto';

@Injectable()
export class CreateScheduledVisitUseCase implements UseCase<CreateScheduledVisitRequestDTO, ScheduledVisitEntity> {
	constructor(
		private readonly repository: IScheduledVisitRepository,
		private readonly listingRepository: IListingRepository,
	) { }
	async execute(request: CreateScheduledVisitRequestDTO): Promise<ScheduledVisitEntity> {
		const listing = await this.listingRepository.findById(request.listingId);
		if (!listing) throw new BadRequestException('Listing does not exist');
		const entity = ScheduledVisitEntity.create({
			...request,
			scheduledDate: new Date(request.scheduledDate),
		});
		return this.repository.create(entity);
	}
}

@Injectable()
export class UpdateScheduledVisitUseCase implements UseCase<{ id: string; data: UpdateScheduledVisitRequestDTO }, ScheduledVisitEntity> {
	constructor(private readonly repository: IScheduledVisitRepository) { }
	async execute({ id, data }: { id: string; data: UpdateScheduledVisitRequestDTO }): Promise<ScheduledVisitEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Scheduled visit not found');
		if (data.scheduledDate !== undefined) entity.scheduledDate = new Date(data.scheduledDate);
		if (data.scheduledTime !== undefined) entity.scheduledTime = data.scheduledTime;
		if (data.status !== undefined) entity.status = data.status;
		if (data.notes !== undefined) entity.notes = data.notes ?? null;
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeleteScheduledVisitUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IScheduledVisitRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Scheduled visit not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListScheduledVisitsUseCase implements UseCase<void, ScheduledVisitEntity[]> {
	constructor(private readonly repository: IScheduledVisitRepository) { }
	async execute(): Promise<ScheduledVisitEntity[]> {
		return this.repository.list();
	}
}

@Injectable()
export class ListScheduledVisitsByListingUseCase implements UseCase<string, ScheduledVisitEntity[]> {
	constructor(private readonly repository: IScheduledVisitRepository) { }
	async execute(listingId: string): Promise<ScheduledVisitEntity[]> {
		return this.repository.listByListing(listingId);
	}
}

@Injectable()
export class ListScheduledVisitsByUserUseCase implements UseCase<string, ScheduledVisitEntity[]> {
	constructor(private readonly repository: IScheduledVisitRepository) { }
	async execute(userId: string): Promise<ScheduledVisitEntity[]> {
		return this.repository.listByUser(userId);
	}
}

@Injectable()
export class FindScheduledVisitByIdUseCase implements UseCase<string, ScheduledVisitEntity | null> {
	constructor(private readonly repository: IScheduledVisitRepository) { }
	async execute(id: string): Promise<ScheduledVisitEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Scheduled visit not found');
		return entity;
	}
}


