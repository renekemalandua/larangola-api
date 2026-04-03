import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { PropertyEntity } from '../entities/property.entity';
import { IPropertyRepository } from '../repositories/IPropertyRepository';
import { IPropertyCategoryRepository } from '../repositories/IPropertyCategoryRepository';
import {
  CreatePropertyRequestDTO,
  UpdatePropertyRequestDTO,
} from '../dto/property.dto';

import { IAgentRepository } from '../repositories/IAgentRepository';

@Injectable()
export class CreatePropertyUseCase implements UseCase<
  CreatePropertyRequestDTO,
  PropertyEntity
> {
  constructor(
    private readonly repository: IPropertyRepository,
    private readonly categoryRepository: IPropertyCategoryRepository,
    private readonly agentRepository: IAgentRepository
  ) {}
  async execute(request: CreatePropertyRequestDTO): Promise<PropertyEntity> {
    console.log(
      '[CreatePropertyUseCase] Executing with request:',
      JSON.stringify(request, null, 2)
    );

    console.log(
      '[CreatePropertyUseCase] Checking categoryId:',
      request.categoryId
    );
    const category = await this.categoryRepository.findById(request.categoryId);
    if (!category) {
      console.error(
        '[CreatePropertyUseCase] Category not found:',
        request.categoryId
      );
      throw new BadRequestException('Category does not exist');
    }
    console.log('[CreatePropertyUseCase] Category found:', category.name);

    // Verify Agent exists
    console.log('[CreatePropertyUseCase] Checking agentId:', request.agentId);
    const agent = await this.agentRepository.findById(request.agentId);
    if (!agent) {
      console.error(
        '[CreatePropertyUseCase] Agent not found:',
        request.agentId
      );
      throw new BadRequestException('Agent not found');
    }
    console.log('[CreatePropertyUseCase] Agent found:', agent.id);
    /* 
    if (!agent) {
      throw new BadRequestException('User is not an agent.');
    }
    if (!agent.isVerified) {
      throw new BadRequestException(
        'Only verified agents can post properties.'
      );
    }
    */

    console.log('[CreatePropertyUseCase] Creating entity...');
    const entity = PropertyEntity.create(request);

    console.log('[CreatePropertyUseCase] Saving entity to repository...');
    const result = await this.repository.create(entity);
    console.log(
      '[CreatePropertyUseCase] Property created successfully:',
      result.id
    );

    return result;
  }
}

@Injectable()
export class UpdatePropertyUseCase implements UseCase<
  { id: string; data: UpdatePropertyRequestDTO },
  PropertyEntity
> {
  constructor(
    private readonly repository: IPropertyRepository,
    private readonly categoryRepository: IPropertyCategoryRepository
  ) {}
  async execute({
    id,
    data,
  }: {
    id: string;
    data: UpdatePropertyRequestDTO;
  }): Promise<PropertyEntity> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Property not found');
    if (data.categoryId) {
      const category = await this.categoryRepository.findById(data.categoryId);
      if (!category) throw new BadRequestException('Category does not exist');
      (entity as any)['props'].categoryId = data.categoryId;
    }
    if (data.title !== undefined) entity.title = data.title;
    if (data.description !== undefined)
      entity.description = data.description ?? null;
    if (data.address !== undefined) entity.address = data.address ?? null;
    if (data.city !== undefined) entity.city = data.city ?? null;
    if (data.state !== undefined) entity.state = data.state ?? null;
    if (data.country !== undefined) entity.country = data.country;
    if (data.latitude !== undefined) entity.latitude = data.latitude ?? null;
    if (data.longitude !== undefined) entity.longitude = data.longitude ?? null;
    if (data.bedrooms !== undefined) entity.bedrooms = data.bedrooms ?? null;
    if (data.bathrooms !== undefined) entity.bathrooms = data.bathrooms ?? null;
    if (data.area !== undefined) entity.area = data.area ?? null;
    if (data.propertyType !== undefined)
      entity.propertyType = data.propertyType;
    if (data.amenities !== undefined) entity.amenities = data.amenities ?? null;
    if (data.images !== undefined) entity.images = data.images ?? null;
    // Map new fields
    if (data.listingType !== undefined)
      entity.listingType = data.listingType ?? null;
    if (data.price !== undefined) entity.price = data.price ?? null;
    if (data.currency !== undefined) entity.currency = data.currency ?? 'AOA';

    // Status Logic & Validation
    if (data.status !== undefined) {
      // If publishing, validate required fields
      if (data.status === 'published' && entity.status !== 'published') {
        const missingFields: string[] = [];
        if (!entity.price && !data.price) missingFields.push('price');
        if (!entity.listingType && !data.listingType)
          missingFields.push('listingType');
        if (!entity.propertyType) missingFields.push('propertyType');

        // Check images
        const imgs = (data.images as string[]) || (entity.images as string[]);
        if (!imgs || imgs.length === 0) missingFields.push('images');

        if (missingFields.length > 0) {
          throw new BadRequestException(
            `Cannot publish. Missing fields: ${missingFields.join(', ')}`
          );
        }
      }
      entity.status = data.status;
    }

    return this.repository.update(entity);
  }
}

@Injectable()
export class DeletePropertyUseCase implements UseCase<string, void> {
  constructor(private readonly repository: IPropertyRepository) {}
  async execute(id: string): Promise<void> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Property not found');
    await this.repository.delete(id);
  }
}

@Injectable()
export class ListPropertiesUseCase implements UseCase<void, PropertyEntity[]> {
  constructor(private readonly repository: IPropertyRepository) {}
  async execute(): Promise<PropertyEntity[]> {
    return this.repository.list();
  }
}

@Injectable()
export class ListPropertiesByAgentUseCase implements UseCase<
  string,
  PropertyEntity[]
> {
  constructor(private readonly repository: IPropertyRepository) {}
  async execute(agentId: string): Promise<PropertyEntity[]> {
    return this.repository.listByAgent(agentId); // Assumes repo method handles agentId filter
  }
}

@Injectable()
export class ListPropertiesByCategoryUseCase implements UseCase<
  string,
  PropertyEntity[]
> {
  constructor(private readonly repository: IPropertyRepository) {}
  async execute(categoryId: string): Promise<PropertyEntity[]> {
    return this.repository.listByCategory(categoryId);
  }
}

@Injectable()
export class FindPropertyByIdUseCase implements UseCase<
  string,
  PropertyEntity | null
> {
  constructor(private readonly repository: IPropertyRepository) {}
  async execute(id: string): Promise<PropertyEntity | null> {
    const entity = await this.repository.findById(id);
    if (!entity) throw new BadRequestException('Property not found');
    return entity;
  }
}
