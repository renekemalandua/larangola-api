import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { PropertyRequestEntity } from '../entities/property-request.entity';
import { IPropertyRequestRepository } from '../repositories/IPropertyRequestRepository';
import {
  CreatePropertyRequestDTO,
  UpdatePropertyRequestDTO,
} from '../dto/property-request.dto';

@Injectable()
export class CreatePropertyRequestUseCase implements UseCase<
  CreatePropertyRequestDTO,
  PropertyRequestEntity
> {
  constructor(private readonly repository: IPropertyRequestRepository) {}
  async execute(
    request: CreatePropertyRequestDTO
  ): Promise<PropertyRequestEntity> {
    const entity = PropertyRequestEntity.create(request);
    return this.repository.create(entity);
  }
}

@Injectable()
export class ListPropertyRequestsUseCase implements UseCase<
  void,
  PropertyRequestEntity[]
> {
  constructor(private readonly repository: IPropertyRequestRepository) {}
  async execute(): Promise<PropertyRequestEntity[]> {
    return this.repository.list();
  }
}

@Injectable()
export class ListMyPropertyRequestsUseCase implements UseCase<
  string,
  PropertyRequestEntity[]
> {
  constructor(private readonly repository: IPropertyRequestRepository) {}
  async execute(userId: string): Promise<PropertyRequestEntity[]> {
    return this.repository.listByUserId(userId);
  }
}

@Injectable()
export class FindPropertyRequestByIdUseCase implements UseCase<
  string,
  PropertyRequestEntity | null
> {
  constructor(private readonly repository: IPropertyRequestRepository) {}
  async execute(id: string): Promise<PropertyRequestEntity | null> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Property Request not found');
    return entity;
  }
}

@Injectable()
export class UpdatePropertyRequestUseCase implements UseCase<
  { id: string; data: UpdatePropertyRequestDTO },
  PropertyRequestEntity
> {
  constructor(private readonly repository: IPropertyRequestRepository) {}
  async execute({
    id,
    data,
  }: {
    id: string;
    data: UpdatePropertyRequestDTO;
  }): Promise<PropertyRequestEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Property Request not found');

    if (data.title !== undefined) entity.title = data.title;
    if (data.description !== undefined)
      entity.description = data.description ?? null;
    if (data.location !== undefined) entity.location = data.location ?? '';
    if (data.propertyType !== undefined)
      entity.propertyType = data.propertyType ?? '';
    if (data.minPrice !== undefined) entity.minPrice = data.minPrice ?? null;
    if (data.maxPrice !== undefined) entity.maxPrice = data.maxPrice ?? null;
    if (data.bedrooms !== undefined) entity.bedrooms = data.bedrooms ?? null;
    if (data.bathrooms !== undefined) entity.bathrooms = data.bathrooms ?? null;
    if (data.status !== undefined) entity.status = data.status;

    return this.repository.update(entity);
  }
}

@Injectable()
export class DeletePropertyRequestUseCase implements UseCase<string, void> {
  constructor(private readonly repository: IPropertyRequestRepository) {}
  async execute(id: string): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Property Request not found');
    await this.repository.delete(id);
  }
}
