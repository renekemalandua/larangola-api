import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProviderModule } from './shared';

// Controllers
import { PropertyCategoryController } from './controllers/property-category.controller';
import { UserController } from './controllers/user.controller';
import { PropertyController } from './controllers/property.controller';
import { ListingController } from './controllers/listing.controller';
import { AgentController } from './controllers/agent.controller';
import { RoommateController } from './controllers/roommate.controller';
import { ScheduledVisitController } from './controllers/scheduled-visit.controller';
import { ReviewController } from './controllers/review.controller';
import { PropertyInterestController } from './controllers/property-interest.controller';
import { ClosedDealController } from './controllers/closed-deal.controller';
import { AgentPlanController } from './controllers/agent-plan.controller';
import { AgentSubscriptionController } from './controllers/agent-subscription.controller';
import { ChatController } from './controllers/chat.controller';
import { MessageController } from './controllers/message.controller';

// Repositories
import { IPropertyCategoryRepository } from './repositories/IPropertyCategoryRepository';
import { PrismaPropertyCategoryRepository } from './repositories/implementation/PrismaPropertyCategoryRepository';
import { IUserRepository } from './repositories/IUserRepository';
import { PrismaUserRepository } from './repositories/implementation/PrismaUserRepository';
import { IPropertyRepository } from './repositories/IPropertyRepository';
import { PrismaPropertyRepository } from './repositories/implementation/PrismaPropertyRepository';
import { IListingRepository } from './repositories/IListingRepository';
import { PrismaListingRepository } from './repositories/implementation/PrismaListingRepository';
import { IAgentRepository } from './repositories/IAgentRepository';
import { PrismaAgentRepository } from './repositories/implementation/PrismaAgentRepository';
import { IRoommateRepository } from './repositories/IRoommateRepository';
import { PrismaRoommateRepository } from './repositories/implementation/PrismaRoommateRepository';
import { IScheduledVisitRepository } from './repositories/IScheduledVisitRepository';
import { PrismaScheduledVisitRepository } from './repositories/implementation/PrismaScheduledVisitRepository';
import { IReviewRepository } from './repositories/IReviewRepository';
import { PrismaReviewRepository } from './repositories/implementation/PrismaReviewRepository';
import { IPropertyInterestRepository } from './repositories/IPropertyInterestRepository';
import { PrismaPropertyInterestRepository } from './repositories/implementation/PrismaPropertyInterestRepository';
import { IClosedDealRepository } from './repositories/IClosedDealRepository';
import { PrismaClosedDealRepository } from './repositories/implementation/PrismaClosedDealRepository';
import { IAgentPlanRepository } from './repositories/IAgentPlanRepository';
import { PrismaAgentPlanRepository } from './repositories/implementation/PrismaAgentPlanRepository';
import { IAgentSubscriptionRepository } from './repositories/IAgentSubscriptionRepository';
import { PrismaAgentSubscriptionRepository } from './repositories/implementation/PrismaAgentSubscriptionRepository';
import { IChatRepository } from './repositories/IChatRepository';
import { PrismaChatRepository } from './repositories/implementation/PrismaChatRepository';
import { IMessageRepository } from './repositories/IMessageRepository';
import { PrismaMessageRepository } from './repositories/implementation/PrismaMessageRepository';

// Use Cases - PropertyCategory
import {
	CreatePropertyCategoryUseCase,
	UpdatePropertyCategoryUseCase,
	DeletePropertyCategoryUseCase,
	ListPropertyCategoriesUseCase,
	FindPropertyCategoryByIdUseCase,
} from './usecases/property-category.usecases';

// Use Cases - User
import {
	CreateUserUseCase,
	UpdateUserUseCase,
	DeleteUserUseCase,
	ListUsersUseCase,
	FindUserByIdUseCase,
	FindUserByEmailUseCase,
} from './usecases/user.usecases';

// Use Cases - Property
import {
	CreatePropertyUseCase,
	UpdatePropertyUseCase,
	DeletePropertyUseCase,
	ListPropertiesUseCase,
	ListPropertiesByOwnerUseCase,
	ListPropertiesByCategoryUseCase,
	FindPropertyByIdUseCase,
} from './usecases/property.usecases';

// Use Cases - Listing
import {
	CreateListingUseCase,
	UpdateListingUseCase,
	DeleteListingUseCase,
	ListListingsUseCase,
	ListListingsByOwnerUseCase,
	ListListingsByPropertyUseCase,
	FindListingByIdUseCase,
} from './usecases/listing.usecases';

// Use Cases - Agent
import {
	CreateAgentUseCase,
	UpdateAgentUseCase,
	DeleteAgentUseCase,
	ListAgentsUseCase,
	FindAgentByIdUseCase,
	FindAgentByUserIdUseCase,
} from './usecases/agent.usecases';

// Use Cases - Roommate
import {
	CreateRoommateUseCase,
	UpdateRoommateUseCase,
	DeleteRoommateUseCase,
	ListRoommatesUseCase,
	FindRoommateByIdUseCase,
	FindRoommateByUserIdUseCase,
} from './usecases/roommate.usecases';

// Use Cases - ScheduledVisit
import {
	CreateScheduledVisitUseCase,
	UpdateScheduledVisitUseCase,
	DeleteScheduledVisitUseCase,
	ListScheduledVisitsUseCase,
	ListScheduledVisitsByListingUseCase,
	ListScheduledVisitsByUserUseCase,
	FindScheduledVisitByIdUseCase,
} from './usecases/scheduled-visit.usecases';

// Use Cases - Review
import {
	CreateReviewUseCase,
	UpdateReviewUseCase,
	DeleteReviewUseCase,
	ListReviewsUseCase,
	ListReviewsByListingUseCase,
	ListReviewsByToUserUseCase,
	FindReviewByIdUseCase,
} from './usecases/review.usecases';

// Use Cases - PropertyInterest
import {
	CreatePropertyInterestUseCase,
	UpdatePropertyInterestUseCase,
	DeletePropertyInterestUseCase,
	ListPropertyInterestsUseCase,
	ListPropertyInterestsByListingUseCase,
	ListPropertyInterestsByUserUseCase,
	FindPropertyInterestByIdUseCase,
} from './usecases/property-interest.usecases';

// Use Cases - ClosedDeal
import {
	CreateClosedDealUseCase,
	UpdateClosedDealUseCase,
	DeleteClosedDealUseCase,
	ListClosedDealsUseCase,
	ListClosedDealsByAgentUseCase,
	ListClosedDealsByClientUseCase,
	FindClosedDealByIdUseCase,
} from './usecases/closed-deal.usecases';

// Use Cases - AgentPlan
import {
	CreateAgentPlanUseCase,
	UpdateAgentPlanUseCase,
	DeleteAgentPlanUseCase,
	ListAgentPlansUseCase,
	FindAgentPlanByIdUseCase,
} from './usecases/agent-plan.usecases';

// Use Cases - AgentSubscription
import {
	CreateAgentSubscriptionUseCase,
	UpdateAgentSubscriptionUseCase,
	DeleteAgentSubscriptionUseCase,
	ListAgentSubscriptionsUseCase,
	ListAgentSubscriptionsByAgentUseCase,
	FindAgentSubscriptionByIdUseCase,
} from './usecases/agent-subscription.usecases';

// Use Cases - Chat
import {
	CreateChatUseCase,
	UpdateChatUseCase,
	DeleteChatUseCase,
	ListChatsUseCase,
	ListChatsByUserUseCase,
	FindChatByIdUseCase,
	FindChatByUsersUseCase,
} from './usecases/chat.usecases';

// Use Cases - Message
import {
	CreateMessageUseCase,
	UpdateMessageUseCase,
	DeleteMessageUseCase,
	ListMessagesUseCase,
	ListMessagesByChatUseCase,
	FindMessageByIdUseCase,
	MarkMessagesAsReadUseCase,
} from './usecases/message.usecases';

@Module({
	imports: [ProviderModule],
	controllers: [
		PropertyCategoryController,
		UserController,
		PropertyController,
		ListingController,
		AgentController,
		RoommateController,
		ScheduledVisitController,
		ReviewController,
		PropertyInterestController,
		ClosedDealController,
		AgentPlanController,
		AgentSubscriptionController,
		ChatController,
		MessageController,
	],
	providers: [
		// Repositories
		{ provide: IPropertyCategoryRepository, useClass: PrismaPropertyCategoryRepository },
		{ provide: IUserRepository, useClass: PrismaUserRepository },
		{ provide: IPropertyRepository, useClass: PrismaPropertyRepository },
		{ provide: IListingRepository, useClass: PrismaListingRepository },
		{ provide: IAgentRepository, useClass: PrismaAgentRepository },
		{ provide: IRoommateRepository, useClass: PrismaRoommateRepository },
		{ provide: IScheduledVisitRepository, useClass: PrismaScheduledVisitRepository },
		{ provide: IReviewRepository, useClass: PrismaReviewRepository },
		{ provide: IPropertyInterestRepository, useClass: PrismaPropertyInterestRepository },
		{ provide: IClosedDealRepository, useClass: PrismaClosedDealRepository },
		{ provide: IAgentPlanRepository, useClass: PrismaAgentPlanRepository },
		{ provide: IAgentSubscriptionRepository, useClass: PrismaAgentSubscriptionRepository },
		{ provide: IChatRepository, useClass: PrismaChatRepository },
		{ provide: IMessageRepository, useClass: PrismaMessageRepository },

		// Use Cases - PropertyCategory
		CreatePropertyCategoryUseCase,
		UpdatePropertyCategoryUseCase,
		DeletePropertyCategoryUseCase,
		ListPropertyCategoriesUseCase,
		FindPropertyCategoryByIdUseCase,

		// Use Cases - User
		CreateUserUseCase,
		UpdateUserUseCase,
		DeleteUserUseCase,
		ListUsersUseCase,
		FindUserByIdUseCase,
		FindUserByEmailUseCase,

		// Use Cases - Property
		CreatePropertyUseCase,
		UpdatePropertyUseCase,
		DeletePropertyUseCase,
		ListPropertiesUseCase,
		ListPropertiesByOwnerUseCase,
		ListPropertiesByCategoryUseCase,
		FindPropertyByIdUseCase,

		// Use Cases - Listing
		CreateListingUseCase,
		UpdateListingUseCase,
		DeleteListingUseCase,
		ListListingsUseCase,
		ListListingsByOwnerUseCase,
		ListListingsByPropertyUseCase,
		FindListingByIdUseCase,

		// Use Cases - Agent
		CreateAgentUseCase,
		UpdateAgentUseCase,
		DeleteAgentUseCase,
		ListAgentsUseCase,
		FindAgentByIdUseCase,
		FindAgentByUserIdUseCase,

		// Use Cases - Roommate
		CreateRoommateUseCase,
		UpdateRoommateUseCase,
		DeleteRoommateUseCase,
		ListRoommatesUseCase,
		FindRoommateByIdUseCase,
		FindRoommateByUserIdUseCase,

		// Use Cases - ScheduledVisit
		CreateScheduledVisitUseCase,
		UpdateScheduledVisitUseCase,
		DeleteScheduledVisitUseCase,
		ListScheduledVisitsUseCase,
		ListScheduledVisitsByListingUseCase,
		ListScheduledVisitsByUserUseCase,
		FindScheduledVisitByIdUseCase,

		// Use Cases - Review
		CreateReviewUseCase,
		UpdateReviewUseCase,
		DeleteReviewUseCase,
		ListReviewsUseCase,
		ListReviewsByListingUseCase,
		ListReviewsByToUserUseCase,
		FindReviewByIdUseCase,

		// Use Cases - PropertyInterest
		CreatePropertyInterestUseCase,
		UpdatePropertyInterestUseCase,
		DeletePropertyInterestUseCase,
		ListPropertyInterestsUseCase,
		ListPropertyInterestsByListingUseCase,
		ListPropertyInterestsByUserUseCase,
		FindPropertyInterestByIdUseCase,

		// Use Cases - ClosedDeal
		CreateClosedDealUseCase,
		UpdateClosedDealUseCase,
		DeleteClosedDealUseCase,
		ListClosedDealsUseCase,
		ListClosedDealsByAgentUseCase,
		ListClosedDealsByClientUseCase,
		FindClosedDealByIdUseCase,

		// Use Cases - AgentPlan
		CreateAgentPlanUseCase,
		UpdateAgentPlanUseCase,
		DeleteAgentPlanUseCase,
		ListAgentPlansUseCase,
		FindAgentPlanByIdUseCase,

		// Use Cases - AgentSubscription
		CreateAgentSubscriptionUseCase,
		UpdateAgentSubscriptionUseCase,
		DeleteAgentSubscriptionUseCase,
		ListAgentSubscriptionsUseCase,
		ListAgentSubscriptionsByAgentUseCase,
		FindAgentSubscriptionByIdUseCase,

		// Use Cases - Chat
		CreateChatUseCase,
		UpdateChatUseCase,
		DeleteChatUseCase,
		ListChatsUseCase,
		ListChatsByUserUseCase,
		FindChatByIdUseCase,
		FindChatByUsersUseCase,

		// Use Cases - Message
		CreateMessageUseCase,
		UpdateMessageUseCase,
		DeleteMessageUseCase,
		ListMessagesUseCase,
		ListMessagesByChatUseCase,
		FindMessageByIdUseCase,
		MarkMessagesAsReadUseCase,
	],
	exports: [FindPropertyCategoryByIdUseCase, FindPropertyByIdUseCase, FindUserByIdUseCase, FindListingByIdUseCase],
})
export class AppModule { }
