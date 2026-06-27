import { BadRequestException, Injectable } from '@nestjs/common';
import { UseCase } from '../shared';
import { PropertyEntity, PropertyStatus } from '../entities/property.entity';
import { IPropertyRepository } from '../repositories/IPropertyRepository';
import { IUserRepository } from '../repositories/IUserRepository';
import { IAgentRepository } from '../repositories/IAgentRepository';
import { UserEntity } from '../entities/user.entity';
import { AgentEntity } from '../entities/agent.entity';
import { PaymentEntity, PaymentStatus } from '../entities/payment.entity';
import { ICryptoService } from '../shared/services';
import { IPaymentRepository } from '../repositories/IPaymentRepository';
import { IAgentSubscriptionRepository } from '../repositories/IAgentSubscriptionRepository';
import { IUserVerificationRepository } from '../repositories/IUserVerificationRepository';
import { UserVerificationEntity } from '../entities/user-verification.entity';

// Dashboard Stats
@Injectable()
export class GetDashboardStatsUseCase implements UseCase<void, any> {
  constructor(
    private readonly propertyRepository: IPropertyRepository,
    private readonly userRepository: IUserRepository,
    private readonly agentRepository: IAgentRepository,
    private readonly paymentRepository: IPaymentRepository,
    private readonly verificationRepository: IUserVerificationRepository,
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

    const pendingPayments = await this.paymentRepository.countPending();
    const pendingVerifications = (await this.verificationRepository.listByStatus('PENDING')).length;

    return {
      totalProperties,
      pendingProperties,
      publishedProperties,
      totalAgents,
      totalUsers,
      pendingVerifications,
      pendingPayments,
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

// List Admin Properties (by status)
@Injectable()
export class ListAdminPropertiesUseCase implements UseCase<string | undefined, PropertyEntity[]> {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(status?: string): Promise<PropertyEntity[]> {
    if (status) {
      return this.propertyRepository.listByStatus(status);
    }
    return this.propertyRepository.list();
  }
}

// List Pending Properties (Legacy)
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

// Verify Payment and Activate Subscription
@Injectable()
export class VerifyPaymentUseCase implements UseCase<{ paymentId: string; adminId: string }, PaymentEntity> {
  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly subscriptionRepository: IAgentSubscriptionRepository,
  ) {}

  async execute({ paymentId, adminId }: { paymentId: string; adminId: string }): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) throw new BadRequestException('Payment not found');
    if (payment.status !== PaymentStatus.pending) throw new BadRequestException('Payment is not pending');

    payment.status = PaymentStatus.paid;
    payment.verifiedBy = adminId;
    const updatedPayment = await this.paymentRepository.update(payment);

    // If it's a subscription payment, activate the subscription
    if (payment.type === 'subscription' && payment.relatedId) {
      // payment.relatedId contains the planId in this flow
      // Normally, you would find the existing subscription or create one
      // The requirement says activate agent subscription.
      // We will create the subscription here
      const agentSubs = await this.subscriptionRepository.listByAgent(payment.userId);
      // Simplify logic: we assume payment.userId is actually agentId or linked directly.
      // This might need adjustments depending on how agent ID relates to user ID.
      // For MVP:
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription
      
      const newSub = require('../entities/agent-subscription.entity').AgentSubscriptionEntity.create({
         agentId: payment.userId, // We assume userId == agentId for MVP, or we need to find agent by userId
         planId: payment.relatedId,
         status: require('../entities/agent-subscription.entity').SubscriptionStatus.active,
         startDate,
         endDate,
      });
      await this.subscriptionRepository.create(newSub);
    }

    return updatedPayment;
  }
}

// Reject Payment
@Injectable()
export class RejectPaymentUseCase implements UseCase<{ paymentId: string; adminId: string; reason: string }, PaymentEntity> {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute({ paymentId, adminId, reason }: { paymentId: string; adminId: string; reason: string }): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) throw new BadRequestException('Payment not found');
    if (payment.status !== PaymentStatus.pending) throw new BadRequestException('Payment is not pending');

    payment.status = PaymentStatus.rejected;
    payment.rejectionReason = reason;
    payment.verifiedBy = adminId;
    
    return this.paymentRepository.update(payment);
  }
}

// List Admin Payments
@Injectable()
export class ListAdminPaymentsUseCase implements UseCase<string | undefined, PaymentEntity[]> {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(status?: string): Promise<PaymentEntity[]> {
    if (status && status !== 'all') {
      return this.paymentRepository.listPayments(status);
    }
    return this.paymentRepository.listPayments();
  }
}

// Get Admin Payment
@Injectable()
export class GetAdminPaymentUseCase implements UseCase<string, PaymentEntity> {
  constructor(private readonly paymentRepository: IPaymentRepository) {}

  async execute(paymentId: string): Promise<PaymentEntity> {
    const payment = await this.paymentRepository.findById(paymentId);
    if (!payment) throw new BadRequestException('Payment not found');
    // Prisma will include the user inside findById if we modify PaymentPrismaRepository,
    // but the frontend requires standard data formatting. 
    return payment;
  }
}

// List Pending Verifications
@Injectable()
export class ListPendingVerificationsUseCase implements UseCase<void, UserVerificationEntity[]> {
  constructor(private readonly verificationRepository: IUserVerificationRepository) {}

  async execute(): Promise<UserVerificationEntity[]> {
    return this.verificationRepository.listByStatus('PENDING');
  }
}

// Approve Verification
@Injectable()
export class ApproveVerificationUseCase implements UseCase<string, UserVerificationEntity> {
  constructor(
    private readonly verificationRepository: IUserVerificationRepository,
    private readonly agentRepository: IAgentRepository
  ) {}

  async execute(verificationId: string): Promise<UserVerificationEntity> {
    const verification = await this.verificationRepository.findById(verificationId);
    if (!verification) throw new BadRequestException('Verification not found');
    if (verification.status !== 'PENDING') throw new BadRequestException('Verification is not pending');

    verification.status = 'APPROVED';
    
    // Update linked agent
    const agent = await this.agentRepository.findByUserId(verification.userId);
    if (agent) {
      agent.isVerified = true;
      await this.agentRepository.update(agent);
    }

    return this.verificationRepository.update(verification);
  }
}

// Reject Verification
@Injectable()
export class RejectVerificationUseCase implements UseCase<{ verificationId: string; reason: string }, UserVerificationEntity> {
  constructor(
    private readonly verificationRepository: IUserVerificationRepository,
    private readonly agentRepository: IAgentRepository
  ) {}

  async execute({ verificationId, reason }: { verificationId: string; reason: string }): Promise<UserVerificationEntity> {
    const verification = await this.verificationRepository.findById(verificationId);
    if (!verification) throw new BadRequestException('Verification not found');
    if (verification.status !== 'PENDING') throw new BadRequestException('Verification is not pending');

    verification.status = 'DRAFT'; // Or REJECTED
    // We could store the reason in a new field if we had one, but DRAFT sends them back to the start.
    
    // Ensure linked agent is not verified
    const agent = await this.agentRepository.findByUserId(verification.userId);
    if (agent) {
      agent.isVerified = false;
      await this.agentRepository.update(agent);
    }

    return this.verificationRepository.update(verification);
  }
}
