import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { PropertyInterestEntity } from '../entities/property-interest.entity';
import { IPropertyInterestRepository } from '../repositories/IPropertyInterestRepository';
import { IListingRepository } from '../repositories/IListingRepository';
import { CreatePropertyInterestRequestDTO, UpdatePropertyInterestRequestDTO } from '../dto/property-interest.dto';

@Injectable()
export class CreatePropertyInterestUseCase implements UseCase<CreatePropertyInterestRequestDTO, PropertyInterestEntity> {
	constructor(
		private readonly repository: IPropertyInterestRepository,
		private readonly listingRepository: IListingRepository,
	) { }
	async execute(request: CreatePropertyInterestRequestDTO): Promise<PropertyInterestEntity> {
		const listing = await this.listingRepository.findById(request.listingId);
		if (!listing) throw new BadRequestException('Listing does not exist');
		const entity = PropertyInterestEntity.create(request);
		return this.repository.create(entity);
	}
}

@Injectable()
export class UpdatePropertyInterestUseCase implements UseCase<{ id: string; data: UpdatePropertyInterestRequestDTO }, PropertyInterestEntity> {
	constructor(private readonly repository: IPropertyInterestRepository) { }
	async execute({ id, data }: { id: string; data: UpdatePropertyInterestRequestDTO }): Promise<PropertyInterestEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Property interest not found');
		if (data.message !== undefined) entity.message = data.message ?? null;
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeletePropertyInterestUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IPropertyInterestRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Property interest not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListPropertyInterestsUseCase implements UseCase<void, PropertyInterestEntity[]> {
	constructor(private readonly repository: IPropertyInterestRepository) { }
	async execute(): Promise<PropertyInterestEntity[]> {
		return this.repository.list();
	}
}

@Injectable()
export class ListPropertyInterestsByListingUseCase implements UseCase<string, PropertyInterestEntity[]> {
	constructor(private readonly repository: IPropertyInterestRepository) { }
	async execute(listingId: string): Promise<PropertyInterestEntity[]> {
		return this.repository.listByListing(listingId);
	}
}

@Injectable()
export class ListPropertyInterestsByUserUseCase implements UseCase<string, PropertyInterestEntity[]> {
	constructor(private readonly repository: IPropertyInterestRepository) { }
	async execute(userId: string): Promise<PropertyInterestEntity[]> {
		return this.repository.listByUser(userId);
	}
}

@Injectable()
export class FindPropertyInterestByIdUseCase implements UseCase<string, PropertyInterestEntity | null> {
	constructor(private readonly repository: IPropertyInterestRepository) { }
	async execute(id: string): Promise<PropertyInterestEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Property interest not found');
		return entity;
	}
}


