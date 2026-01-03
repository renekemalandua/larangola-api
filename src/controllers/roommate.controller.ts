import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
	CreateRoommateUseCase,
	UpdateRoommateUseCase,
	DeleteRoommateUseCase,
	ListRoommatesUseCase,
	FindRoommateByIdUseCase,
	FindRoommateByUserIdUseCase,
} from '../usecases/roommate.usecases';
import { CreateRoommateRequestDTO, UpdateRoommateRequestDTO } from '../dto/roommate.dto';
import { RoommateAdapter } from '../adapters/roommate.adapter';

@ApiTags('Roommates')
@Controller('roommates')
export class RoommateController {
	constructor(
		private readonly createUseCase: CreateRoommateUseCase,
		private readonly updateUseCase: UpdateRoommateUseCase,
		private readonly deleteUseCase: DeleteRoommateUseCase,
		private readonly listUseCase: ListRoommatesUseCase,
		private readonly findByIdUseCase: FindRoommateByIdUseCase,
		private readonly findByUserIdUseCase: FindRoommateByUserIdUseCase,
	) { }

	@Post('create')
	@ApiOperation({ summary: 'Create a new Roommate' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async create(@Body() body: CreateRoommateRequestDTO, @Res() response) {
		try {
			const entity = await this.createUseCase.execute(body);
			const data = RoommateAdapter.toHttp(entity);
			return response.status(201).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('list')
	@ApiOperation({ summary: 'List all Roommates' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async list(@Res() response) {
		try {
			const entities = await this.listUseCase.execute();
			const data = entities.map((e) => RoommateAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Find Roommate by ID' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findById(@Param('id') id: string, @Res() response) {
		try {
			const entity = await this.findByIdUseCase.execute(id);
			const data = RoommateAdapter.toHttp(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('user/:userId')
	@ApiOperation({ summary: 'Find Roommate by User ID' })
	@ApiParam({ name: 'userId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findByUserId(@Param('userId') userId: string, @Res() response) {
		try {
			const entity = await this.findByUserIdUseCase.execute(userId);
			const data = RoommateAdapter.toHttp(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update Roommate' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async update(@Param('id') id: string, @Body() body: UpdateRoommateRequestDTO, @Res() response) {
		try {
			const entity = await this.updateUseCase.execute({ id, data: body });
			const data = RoommateAdapter.toHttp(entity);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete Roommate' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async delete(@Param('id') id: string, @Res() response) {
		try {
			await this.deleteUseCase.execute(id);
			return response.status(200).json({ status: true, data: { message: 'Roommate deleted successfully' } });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}

