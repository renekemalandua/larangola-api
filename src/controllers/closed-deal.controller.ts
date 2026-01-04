import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
	CreateClosedDealUseCase,
	UpdateClosedDealUseCase,
	DeleteClosedDealUseCase,
	ListClosedDealsUseCase,
	ListClosedDealsByAgentUseCase,
	ListClosedDealsByClientUseCase,
	FindClosedDealByIdUseCase,
} from '../usecases/closed-deal.usecases';
import { CreateClosedDealRequestDTO, UpdateClosedDealRequestDTO } from '../dto/closed-deal.dto';
import { ClosedDealAdapter } from '../adapters/closed-deal.adapter';

@ApiTags('Closed Deals')
@Controller('closed-deals')
export class ClosedDealController {
	constructor(
		private readonly createUseCase: CreateClosedDealUseCase,
		private readonly updateUseCase: UpdateClosedDealUseCase,
		private readonly deleteUseCase: DeleteClosedDealUseCase,
		private readonly listUseCase: ListClosedDealsUseCase,
		private readonly listByAgentUseCase: ListClosedDealsByAgentUseCase,
		private readonly listByClientUseCase: ListClosedDealsByClientUseCase,
		private readonly findByIdUseCase: FindClosedDealByIdUseCase,
	) { }

	@Post('create')
	@ApiOperation({ summary: 'Create a new Closed Deal' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async create(@Body() body: CreateClosedDealRequestDTO, @Res() response) {
		try {
			const entity = await this.createUseCase.execute(body);
			const data = ClosedDealAdapter.toHttp(entity);
			return response.status(201).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('list')
	@ApiOperation({ summary: 'List all Closed Deals' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async list(@Res() response) {
		try {
			const entities = await this.listUseCase.execute();
			const data = entities.map((e) => ClosedDealAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Find Closed Deal by ID' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findById(@Param('id') id: string, @Res() response) {
		try {
			const entity = await this.findByIdUseCase.execute(id);
			const data = ClosedDealAdapter.toHttp(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('agent/:agentId')
	@ApiOperation({ summary: 'List Closed Deals by Agent' })
	@ApiParam({ name: 'agentId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByAgent(@Param('agentId') agentId: string, @Res() response) {
		try {
			const entities = await this.listByAgentUseCase.execute(agentId);
			const data = entities.map((e) => ClosedDealAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('client/:clientId')
	@ApiOperation({ summary: 'List Closed Deals by Client' })
	@ApiParam({ name: 'clientId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByClient(@Param('clientId') clientId: string, @Res() response) {
		try {
			const entities = await this.listByClientUseCase.execute(clientId);
			const data = entities.map((e) => ClosedDealAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update Closed Deal' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async update(@Param('id') id: string, @Body() body: UpdateClosedDealRequestDTO, @Res() response) {
		try {
			const entity = await this.updateUseCase.execute({ id, data: body });
			const data = ClosedDealAdapter.toHttp(entity);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete Closed Deal' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async delete(@Param('id') id: string, @Res() response) {
		try {
			await this.deleteUseCase.execute(id);
			return response.status(200).json({ status: true, data: { message: 'Closed deal deleted successfully' } });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}


