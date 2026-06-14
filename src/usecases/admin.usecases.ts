import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { PropertyEntity, PropertyStatus } from '../entities/property.entity';
import { IPropertyRepository } from '../repositories/IPropertyRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IAgentRepository } from '../repositories/IAgentRepository';
import { UserEntity } from '../entities/user.entity';
import { AgentEntity } from '../entities/agent.entity';
import { ICryptoService } from '../shared/services';

// Dashboard Stats
@Injectable()
export class GetDashboardStatsUseCase implements UseCase<void, any> {
  constructor(
    private readonly propertyRepository: IPropertyRepository,
    private readonly userRepository: IUserRepository,
    private readonly agentRepository: IAgentRepository,
  ) {}

  async execute(): Promise<any> {
    const [
      totalProperties,
      pendingProperties,
      publishedProperties,
      totalAgents,
      totalUsers,
    ] = await Promise.all([
      this.propertyRepository.count(),
      this.propertyRepository.countByStatus('pending_approval'),
      this.propertyRepository.countByStatus('published'),
      this.agentRepository.count(),
      this.userRepository.count(),
    ]);

    return {
      totalProperties,
      pendingProperties,
      publishedProperties,
      totalAgents,
      totalUsers,
      pendingVerifications: 0, // TODO: Add verification count
    };
  }
}

// Approve Property
@Injectable()
export class ApprovePropertyUseCase implements UseCase<
  { propertyId: string; adminId: string },
  PropertyEntity
> {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute({
    propertyId,
    adminId,
  }: {
    propertyId: string;
    adminId: string;
  }): Promise<PropertyEntity> {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      throw new BadRequestException('Property not found');
    }

    if (property.status !== 'pending_approval') {
      throw new BadRequestException('Property is not pending approval');
    }

    property.status = PropertyStatus.published;
    property.reviewedBy = adminId;
    property.reviewedAt = new Date();

    return this.propertyRepository.update(property);
  }
}

// Reject Property
@Injectable()
export class RejectPropertyUseCase implements UseCase<
  { propertyId: string; adminId: string; reason: string },
  PropertyEntity
> {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute({
    propertyId,
    adminId,
    reason,
  }: {
    propertyId: string;
    adminId: string;
    reason: string;
  }): Promise<PropertyEntity> {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      throw new BadRequestException('Property not found');
    }

    if (property.status !== 'pending_approval') {
      throw new BadRequestException('Property is not pending approval');
    }

    property.status = PropertyStatus.rejected;
    property.rejectionReason = reason;
    property.reviewedBy = adminId;
    property.reviewedAt = new Date();

    return this.propertyRepository.update(property);
  }
}

// List Pending Properties
@Injectable()
export class ListPendingPropertiesUseCase implements UseCase<void, PropertyEntity[]> {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(): Promise<PropertyEntity[]> {
    return this.propertyRepository.listByStatus('pending_approval');
  }
}

// Create Agent (Admin creates agent account)
@Injectable()
export class AdminCreateAgentUseCase implements UseCase<
  {
    name: string;
    email: string;
    phone: string;
    password: string;
    profession?: string;
    company?: string;
    location?: string;
    bio?: string;
  },
  { user: UserEntity; agent: AgentEntity }
> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly agentRepository: IAgentRepository,
    private readonly cryptoService: ICryptoService,
  ) {}

  async execute(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    profession?: string;
    company?: string;
    location?: string;
    bio?: string;
  }): Promise<{ user: UserEntity; agent: AgentEntity }> {
    // Check if email exists
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Check if phone exists
    const existingPhone = await this.userRepository.findByPhone(data.phone);
    if (existingPhone) {
      throw new BadRequestException('Phone already exists');
    }

    // Hash password
    const hashedPassword = await this.cryptoService.hash(data.password);

    // Create user
    const user = UserEntity.create({
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      name: data.name,
    });

    const savedUser = await this.userRepository.create(user);

    // Create agent profile
    const agent = AgentEntity.create({
      userId: savedUser.id,
      profession: data.profession || null,
      company: data.company || null,
      location: data.location || null,
      bio: data.bio || null,
      isVerified: true, // Admin created, so auto-verified
    });

    const savedAgent = await this.agentRepository.create(agent);

    return { user: savedUser, agent: savedAgent };
  }
}

// Verify Agent
@Injectable()
export class VerifyAgentUseCase implements UseCase<string, AgentEntity> {
  constructor(private readonly agentRepository: IAgentRepository) {}

  async execute(agentId: string): Promise<AgentEntity> {
    const agent = await this.agentRepository.findById(agentId);

    if (!agent) {
      throw new BadRequestException('Agent not found');
    }

    agent.isVerified = true;

    return this.agentRepository.update(agent);
  }
}

// List Pending Agents (not verified)
@Injectable()
export class ListPendingAgentsUseCase implements UseCase<void, AgentEntity[]> {
  constructor(private readonly agentRepository: IAgentRepository) {}

  async execute(): Promise<AgentEntity[]> {
    return this.agentRepository.listPending();
  }
}
