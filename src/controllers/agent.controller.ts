import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
	CreateAgentUseCase,
	UpdateAgentUseCase,
	DeleteAgentUseCase,
	ListAgentsUseCase,
	FindAgentByIdUseCase,
	FindAgentByUserIdUseCase,
} from '../usecases/agent.usecases';
import { CreateAgentRequestDTO, UpdateAgentRequestDTO } from '../dto/agent.dto';
import { AgentAdapter } from '../adapters/agent.adapter';

@ApiTags('Agents')
@Controller('agents')
export class AgentController {
	constructor(
		private readonly createUseCase: CreateAgentUseCase,
		private readonly updateUseCase: UpdateAgentUseCase,
		private readonly deleteUseCase: DeleteAgentUseCase,
		private readonly listUseCase: ListAgentsUseCase,
		private readonly findByIdUseCase: FindAgentByIdUseCase,
		private readonly findByUserIdUseCase: FindAgentByUserIdUseCase,
	) { }

	@Post('create')
	@ApiOperation({ summary: 'Create a new Agent' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async create(@Body() body: CreateAgentRequestDTO, @Res() response) {
		try {
			const entity = await this.createUseCase.execute(body);
			const data = AgentAdapter.toHttp(entity);
			return response.status(201).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('list')
	@ApiOperation({ summary: 'List all Agents' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async list(@Res() response) {
		try {
			const entities = await this.listUseCase.execute();
			const data = entities.map((e) => AgentAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Find Agent by ID' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findById(@Param('id') id: string, @Res() response) {
		try {
			const entity = await this.findByIdUseCase.execute(id);
			const data = AgentAdapter.toHttp(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('user/:userId')
	@ApiOperation({ summary: 'Find Agent by User ID' })
	@ApiParam({ name: 'userId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findByUserId(@Param('userId') userId: string, @Res() response) {
		try {
			const entity = await this.findByUserIdUseCase.execute(userId);
			const data = AgentAdapter.toHttp(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update Agent' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async update(@Param('id') id: string, @Body() body: UpdateAgentRequestDTO, @Res() response) {
		try {
			const entity = await this.updateUseCase.execute({ id, data: body });
			const data = AgentAdapter.toHttp(entity);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete Agent' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async delete(@Param('id') id: string, @Res() response) {
		try {
			await this.deleteUseCase.execute(id);
			return response.status(200).json({ status: true, data: { message: 'Agent deleted successfully' } });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}


