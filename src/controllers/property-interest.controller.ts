import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
	CreatePropertyInterestUseCase,
	UpdatePropertyInterestUseCase,
	DeletePropertyInterestUseCase,
	ListPropertyInterestsUseCase,
	ListPropertyInterestsByListingUseCase,
	ListPropertyInterestsByUserUseCase,
	FindPropertyInterestByIdUseCase,
} from '../usecases/property-interest.usecases';
import { CreatePropertyInterestRequestDTO, UpdatePropertyInterestRequestDTO } from '../dto/property-interest.dto';
import { PropertyInterestAdapter } from '../adapters/property-interest.adapter';

@ApiTags('Property Interests')
@Controller('property-interests')
export class PropertyInterestController {
	constructor(
		private readonly createUseCase: CreatePropertyInterestUseCase,
		private readonly updateUseCase: UpdatePropertyInterestUseCase,
		private readonly deleteUseCase: DeletePropertyInterestUseCase,
		private readonly listUseCase: ListPropertyInterestsUseCase,
		private readonly listByListingUseCase: ListPropertyInterestsByListingUseCase,
		private readonly listByUserUseCase: ListPropertyInterestsByUserUseCase,
		private readonly findByIdUseCase: FindPropertyInterestByIdUseCase,
	) { }

	@Post('create')
	@ApiOperation({ summary: 'Create a new Property Interest' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async create(@Body() body: CreatePropertyInterestRequestDTO, @Res() response) {
		try {
			const entity = await this.createUseCase.execute(body);
			const data = PropertyInterestAdapter.toHttp(entity);
			return response.status(201).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('list')
	@ApiOperation({ summary: 'List all Property Interests' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async list(@Res() response) {
		try {
			const entities = await this.listUseCase.execute();
			const data = entities.map((e) => PropertyInterestAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Find Property Interest by ID' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findById(@Param('id') id: string, @Res() response) {
		try {
			const entity = await this.findByIdUseCase.execute(id);
			const data = PropertyInterestAdapter.toHttp(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('listing/:listingId')
	@ApiOperation({ summary: 'List Property Interests by Listing' })
	@ApiParam({ name: 'listingId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByListing(@Param('listingId') listingId: string, @Res() response) {
		try {
			const entities = await this.listByListingUseCase.execute(listingId);
			const data = entities.map((e) => PropertyInterestAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('user/:userId')
	@ApiOperation({ summary: 'List Property Interests by User' })
	@ApiParam({ name: 'userId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByUser(@Param('userId') userId: string, @Res() response) {
		try {
			const entities = await this.listByUserUseCase.execute(userId);
			const data = entities.map((e) => PropertyInterestAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update Property Interest' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async update(@Param('id') id: string, @Body() body: UpdatePropertyInterestRequestDTO, @Res() response) {
		try {
			const entity = await this.updateUseCase.execute({ id, data: body });
			const data = PropertyInterestAdapter.toHttp(entity);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete Property Interest' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async delete(@Param('id') id: string, @Res() response) {
		try {
			await this.deleteUseCase.execute(id);
			return response.status(200).json({ status: true, data: { message: 'Property interest deleted successfully' } });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}


