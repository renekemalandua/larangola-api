import { Injectable, BadRequestException } from '@nestjs/common';
import { IPropertyAuditRequestRepository } from '../repositories/IPropertyAuditRequestRepository';
import { IPropertyRepository } from '../repositories/IPropertyRepository';
import { CreatePropertyAuditRequestDTO } from '../dto/property-audit-request.dto';
import { PropertyAuditRequest } from '../entities/PropertyAuditRequest';

@Injectable()
export class CreatePropertyAuditRequestUseCase {
  constructor(private readonly repository: IPropertyAuditRequestRepository) {}

  async execute(data: CreatePropertyAuditRequestDTO): Promise<PropertyAuditRequest> {
    return this.repository.create(data as any);
  }
}

@Injectable()
export class ListPendingPropertyAuditRequestsUseCase {
  constructor(private readonly repository: IPropertyAuditRequestRepository) {}

  async execute(): Promise<PropertyAuditRequest[]> {
    return this.repository.findPending();
  }
}

@Injectable()
export class ListMyPropertyAuditRequestsUseCase {
  constructor(private readonly repository: IPropertyAuditRequestRepository) {}

  async execute(userId: string): Promise<PropertyAuditRequest[]> {
    return this.repository.findByUserId(userId);
  }
}

@Injectable()
export class ListMyValidationsUseCase {
  constructor(private readonly repository: IPropertyAuditRequestRepository) {}

  async execute(agentId: string): Promise<PropertyAuditRequest[]> {
    return this.repository.findByAgentId(agentId);
  }
}

@Injectable()
export class ClaimPropertyAuditRequestUseCase {
  constructor(private readonly repository: IPropertyAuditRequestRepository) {}

  async execute(id: string, agentId: string): Promise<PropertyAuditRequest> {
    const request = await this.repository.findById(id);
    if (!request) {
      throw new BadRequestException('Request not found');
    }
    if (request.status !== 'PENDING') {
      throw new BadRequestException('Property is no longer available in the pool');
    }
    return this.repository.updateStatus(id, 'VALIDATING', agentId);
  }
}

@Injectable()
export class ApprovePropertyAuditRequestUseCase {
  constructor(
    private readonly repository: IPropertyAuditRequestRepository,
    private readonly propertyRepository: IPropertyRepository
  ) {}

  async execute(id: string, agentId: string, categoryId: string): Promise<any> {
    const request = await this.repository.findById(id);
    if (!request) throw new BadRequestException('Request not found');
    if (request.status !== 'VALIDATING' || request.claimedByAgentId !== agentId) {
      throw new BadRequestException('You do not have permission to approve this request');
    }

    // Convert to official property
    const newPropertyData = {
      agentId: agentId,
      categoryId: categoryId,
      title: request.title,
      description: request.description,
      address: request.address,
      city: request.city,
      state: request.state,
      country: 'Angola',
      bedrooms: request.bedrooms,
      bathrooms: request.bathrooms,
      area: request.area,
      price: request.price,
      currency: request.currency,
      propertyType: request.propertyType,
      listingType: request.listingType,
      images: request.images,
      status: 'published' as any
    };

    const newProperty = await this.propertyRepository.create(newPropertyData as any);
    await this.repository.updateStatus(id, 'APPROVED', agentId, `Converted to Property ID: ${newProperty.id}`);
    
    return newProperty;
  }
}

@Injectable()
export class RejectPropertyAuditRequestUseCase {
  constructor(private readonly repository: IPropertyAuditRequestRepository) {}

  async execute(id: string, agentId: string, notes: string): Promise<PropertyAuditRequest> {
    const request = await this.repository.findById(id);
    if (!request) throw new BadRequestException('Request not found');
    if (request.claimedByAgentId !== agentId) {
      throw new BadRequestException('You do not have permission to reject this request');
    }
    return this.repository.updateStatus(id, 'REJECTED', agentId, notes);
  }
}

@Injectable()
export class CancelPropertyAuditRequestUseCase {
  constructor(private readonly repository: IPropertyAuditRequestRepository) {}

  async execute(id: string, agentId: string): Promise<PropertyAuditRequest> {
    const request = await this.repository.findById(id);
    if (!request) throw new BadRequestException('Request not found');
    if (request.claimedByAgentId !== agentId) {
      throw new BadRequestException('You do not have permission to cancel this request');
    }
    // Returns it to PENDING pool
    return this.repository.updateStatus(id, 'PENDING', null);
  }
}
