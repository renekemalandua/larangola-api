import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
	CreatePropertyUseCase,
	DeletePropertyUseCase,
	FindPropertyByIdUseCase,
	ListPropertiesByCategoryUseCase,
	ListPropertiesByOwnerUseCase,
	ListPropertiesUseCase,
	UpdatePropertyUseCase,
} from '../usecases/property.usecases';
import { CreatePropertyRequestDTO, UpdatePropertyRequestDTO } from '../dto/property.dto';
import { PropertyAdapter } from '../adapters/property.adapter';

@ApiTags('Properties')
@Controller('properties')
export class PropertyController {
	constructor(
		private readonly createUseCase: CreatePropertyUseCase,
		private readonly updateUseCase: UpdatePropertyUseCase,
		private readonly deleteUseCase: DeletePropertyUseCase,
		private readonly listUseCase: ListPropertiesUseCase,
		private readonly listByOwnerUseCase: ListPropertiesByOwnerUseCase,
		private readonly listByCategoryUseCase: ListPropertiesByCategoryUseCase,
		private readonly findByIdUseCase: FindPropertyByIdUseCase,
	) { }

	@Post('create')
	@ApiOperation({ summary: 'Create a new Property' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async create(@Body() body: CreatePropertyRequestDTO, @Res() response) {
		try {
			const entity = await this.createUseCase.execute(body);
			const data = PropertyAdapter.toHttp(entity);
			return response.status(201).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('list')
	@ApiOperation({ summary: 'List all Properties' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async list(@Res() response) {
		try {
			const entities = await this.listUseCase.execute();
			const data = entities.map((e) => PropertyAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Find Property by ID' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findById(@Param('id') id: string, @Res() response) {
		try {
			const entity = await this.findByIdUseCase.execute(id);
			const data = PropertyAdapter.toHttp(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('owner/:ownerId')
	@ApiOperation({ summary: 'List Properties by Owner' })
	@ApiParam({ name: 'ownerId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByOwner(@Param('ownerId') ownerId: string, @Res() response) {
		try {
			const entities = await this.listByOwnerUseCase.execute(ownerId);
			const data = entities.map((e) => PropertyAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('category/:categoryId')
	@ApiOperation({ summary: 'List Properties by Category' })
	@ApiParam({ name: 'categoryId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByCategory(@Param('categoryId') categoryId: string, @Res() response) {
		try {
			const entities = await this.listByCategoryUseCase.execute(categoryId);
			const data = entities.map((e) => PropertyAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update Property' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async update(@Param('id') id: string, @Body() body: UpdatePropertyRequestDTO, @Res() response) {
		try {
			const entity = await this.updateUseCase.execute({ id, data: body });
			const data = PropertyAdapter.toHttp(entity);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete Property' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async delete(@Param('id') id: string, @Res() response) {
		try {
			await this.deleteUseCase.execute(id);
			return response.status(200).json({ status: true, data: { message: 'Property deleted successfully' } });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}

