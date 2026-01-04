import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
	CreateScheduledVisitUseCase,
	UpdateScheduledVisitUseCase,
	DeleteScheduledVisitUseCase,
	ListScheduledVisitsUseCase,
	ListScheduledVisitsByListingUseCase,
	ListScheduledVisitsByUserUseCase,
	FindScheduledVisitByIdUseCase,
} from '../usecases/scheduled-visit.usecases';
import { CreateScheduledVisitRequestDTO, UpdateScheduledVisitRequestDTO } from '../dto/scheduled-visit.dto';
import { ScheduledVisitAdapter } from '../adapters/scheduled-visit.adapter';

@ApiTags('Scheduled Visits')
@Controller('scheduled-visits')
export class ScheduledVisitController {
	constructor(
		private readonly createUseCase: CreateScheduledVisitUseCase,
		private readonly updateUseCase: UpdateScheduledVisitUseCase,
		private readonly deleteUseCase: DeleteScheduledVisitUseCase,
		private readonly listUseCase: ListScheduledVisitsUseCase,
		private readonly listByListingUseCase: ListScheduledVisitsByListingUseCase,
		private readonly listByUserUseCase: ListScheduledVisitsByUserUseCase,
		private readonly findByIdUseCase: FindScheduledVisitByIdUseCase,
	) { }

	@Post('create')
	@ApiOperation({ summary: 'Create a new Scheduled Visit' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async create(@Body() body: CreateScheduledVisitRequestDTO, @Res() response) {
		try {
			const entity = await this.createUseCase.execute(body);
			const data = ScheduledVisitAdapter.toHttp(entity);
			return response.status(201).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('list')
	@ApiOperation({ summary: 'List all Scheduled Visits' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async list(@Res() response) {
		try {
			const entities = await this.listUseCase.execute();
			const data = entities.map((e) => ScheduledVisitAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Find Scheduled Visit by ID' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findById(@Param('id') id: string, @Res() response) {
		try {
			const entity = await this.findByIdUseCase.execute(id);
			const data = ScheduledVisitAdapter.toHttp(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('listing/:listingId')
	@ApiOperation({ summary: 'List Scheduled Visits by Listing' })
	@ApiParam({ name: 'listingId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByListing(@Param('listingId') listingId: string, @Res() response) {
		try {
			const entities = await this.listByListingUseCase.execute(listingId);
			const data = entities.map((e) => ScheduledVisitAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('user/:userId')
	@ApiOperation({ summary: 'List Scheduled Visits by User' })
	@ApiParam({ name: 'userId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByUser(@Param('userId') userId: string, @Res() response) {
		try {
			const entities = await this.listByUserUseCase.execute(userId);
			const data = entities.map((e) => ScheduledVisitAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update Scheduled Visit' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async update(@Param('id') id: string, @Body() body: UpdateScheduledVisitRequestDTO, @Res() response) {
		try {
			const entity = await this.updateUseCase.execute({ id, data: body });
			const data = ScheduledVisitAdapter.toHttp(entity);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete Scheduled Visit' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async delete(@Param('id') id: string, @Res() response) {
		try {
			await this.deleteUseCase.execute(id);
			return response.status(200).json({ status: true, data: { message: 'Scheduled visit deleted successfully' } });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}


