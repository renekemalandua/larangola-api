import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
	CreateAgentSubscriptionUseCase,
	UpdateAgentSubscriptionUseCase,
	DeleteAgentSubscriptionUseCase,
	ListAgentSubscriptionsUseCase,
	ListAgentSubscriptionsByAgentUseCase,
	FindAgentSubscriptionByIdUseCase,
} from '../usecases/agent-subscription.usecases';
import { CreateAgentSubscriptionRequestDTO, UpdateAgentSubscriptionRequestDTO } from '../dto/agent-subscription.dto';
import { AgentSubscriptionAdapter } from '../adapters/agent-subscription.adapter';

@ApiTags('Agent Subscriptions')
@Controller('agent-subscriptions')
export class AgentSubscriptionController {
	constructor(
		private readonly createUseCase: CreateAgentSubscriptionUseCase,
		private readonly updateUseCase: UpdateAgentSubscriptionUseCase,
		private readonly deleteUseCase: DeleteAgentSubscriptionUseCase,
		private readonly listUseCase: ListAgentSubscriptionsUseCase,
		private readonly listByAgentUseCase: ListAgentSubscriptionsByAgentUseCase,
		private readonly findByIdUseCase: FindAgentSubscriptionByIdUseCase,
	) { }

	@Post('create')
	@ApiOperation({ summary: 'Create a new Agent Subscription' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async create(@Body() body: CreateAgentSubscriptionRequestDTO, @Res() response) {
		try {
			const entity = await this.createUseCase.execute(body);
			const data = AgentSubscriptionAdapter.toHttp(entity);
			return response.status(201).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('list')
	@ApiOperation({ summary: 'List all Agent Subscriptions' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async list(@Res() response) {
		try {
			const entities = await this.listUseCase.execute();
			const data = entities.map((e) => AgentSubscriptionAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Find Agent Subscription by ID' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findById(@Param('id') id: string, @Res() response) {
		try {
			const entity = await this.findByIdUseCase.execute(id);
			const data = AgentSubscriptionAdapter.toHttp(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('agent/:agentId')
	@ApiOperation({ summary: 'List Agent Subscriptions by Agent' })
	@ApiParam({ name: 'agentId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByAgent(@Param('agentId') agentId: string, @Res() response) {
		try {
			const entities = await this.listByAgentUseCase.execute(agentId);
			const data = entities.map((e) => AgentSubscriptionAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update Agent Subscription' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async update(@Param('id') id: string, @Body() body: UpdateAgentSubscriptionRequestDTO, @Res() response) {
		try {
			const entity = await this.updateUseCase.execute({ id, data: body });
			const data = AgentSubscriptionAdapter.toHttp(entity);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete Agent Subscription' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async delete(@Param('id') id: string, @Res() response) {
		try {
			await this.deleteUseCase.execute(id);
			return response.status(200).json({ status: true, data: { message: 'Agent subscription deleted successfully' } });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}


