import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { RoommateEntity } from '../entities/roommate.entity';
import { IRoommateRepository } from '../repositories/IRoommateRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { CreateRoommateRequestDTO, UpdateRoommateRequestDTO } from '../dto/roommate.dto';

@Injectable()
export class CreateRoommateUseCase implements UseCase<CreateRoommateRequestDTO, RoommateEntity> {
	constructor(
		private readonly repository: IRoommateRepository,
		private readonly userRepository: IUserRepository,
	) { }
	async execute(request: CreateRoommateRequestDTO): Promise<RoommateEntity> {
		const user = await this.userRepository.findById(request.userId);
		if (!user) throw new BadRequestException('User does not exist');
		const existing = await this.repository.findByUserId(request.userId);
		if (existing) throw new BadRequestException('Roommate already exists for this user');
		const entity = RoommateEntity.create({
			...request,
			moveInDate: request.moveInDate ? new Date(request.moveInDate) : null,
		});
		return this.repository.create(entity);
	}
}

@Injectable()
export class UpdateRoommateUseCase implements UseCase<{ id: string; data: UpdateRoommateRequestDTO }, RoommateEntity> {
	constructor(private readonly repository: IRoommateRepository) { }
	async execute({ id, data }: { id: string; data: UpdateRoommateRequestDTO }): Promise<RoommateEntity> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Roommate not found');
		if (data.age !== undefined) entity.age = data.age ?? null;
		if (data.profession !== undefined) entity.profession = data.profession ?? null;
		if (data.company !== undefined) entity.company = data.company ?? null;
		if (data.location !== undefined) entity.location = data.location ?? null;
		if (data.budget !== undefined) entity.budget = data.budget ?? null;
		if (data.moveInDate !== undefined) entity.moveInDate = data.moveInDate ? new Date(data.moveInDate) : null;
		if (data.bio !== undefined) entity.bio = data.bio ?? null;
		if (data.isVerified !== undefined) entity.isVerified = data.isVerified;
		if (data.responseRate !== undefined) entity.responseRate = data.responseRate ?? null;
		if (data.averageResponseTime !== undefined) entity.averageResponseTime = data.averageResponseTime ?? null;
		if (data.rating !== undefined) entity.rating = data.rating ?? null;
		if (data.lookingForRoommate !== undefined) entity.lookingForRoommate = data.lookingForRoommate;
		if (data.preferences !== undefined) entity.preferences = data.preferences ?? null;
		if (data.lifestyle !== undefined) entity.lifestyle = data.lifestyle ?? null;
		if (data.interests !== undefined) entity.interests = data.interests ?? null;
		if (data.languages !== undefined) entity.languages = data.languages ?? null;
		return this.repository.update(entity);
	}
}

@Injectable()
export class DeleteRoommateUseCase implements UseCase<string, void> {
	constructor(private readonly repository: IRoommateRepository) { }
	async execute(id: string): Promise<void> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Roommate not found');
		await this.repository.delete(id);
	}
}

@Injectable()
export class ListRoommatesUseCase implements UseCase<void, RoommateEntity[]> {
	constructor(private readonly repository: IRoommateRepository) { }
	async execute(): Promise<RoommateEntity[]> {
		return this.repository.list();
	}
}

@Injectable()
export class FindRoommateByIdUseCase implements UseCase<string, RoommateEntity | null> {
	constructor(private readonly repository: IRoommateRepository) { }
	async execute(id: string): Promise<RoommateEntity | null> {
		const entity = await this.repository.findById(id);
		if (!entity) throw new BadRequestException('Roommate not found');
		return entity;
	}
}

@Injectable()
export class FindRoommateByUserIdUseCase implements UseCase<string, RoommateEntity | null> {
	constructor(private readonly repository: IRoommateRepository) { }
	async execute(userId: string): Promise<RoommateEntity | null> {
		const entity = await this.repository.findByUserId(userId);
		if (!entity) throw new BadRequestException('Roommate not found');
		return entity;
	}
}

