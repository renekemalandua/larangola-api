import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
	CreateListingUseCase,
	DeleteListingUseCase,
	FindListingByIdUseCase,
	ListListingsByOwnerUseCase,
	ListListingsByPropertyUseCase,
	ListListingsUseCase,
	UpdateListingUseCase,
} from '../usecases/listing.usecases';
import { CreateListingRequestDTO, UpdateListingRequestDTO } from '../dto/listing.dto';
import { ListingAdapter } from '../adapters/listing.adapter';

@ApiTags('Listings')
@Controller('listings')
export class ListingController {
	constructor(
		private readonly createUseCase: CreateListingUseCase,
		private readonly updateUseCase: UpdateListingUseCase,
		private readonly deleteUseCase: DeleteListingUseCase,
		private readonly listUseCase: ListListingsUseCase,
		private readonly listByOwnerUseCase: ListListingsByOwnerUseCase,
		private readonly listByPropertyUseCase: ListListingsByPropertyUseCase,
		private readonly findByIdUseCase: FindListingByIdUseCase,
	) { }

	@Post('create')
	@ApiOperation({ summary: 'Create a new Listing' })
	@ApiResponse({ status: 201 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async create(@Body() body: CreateListingRequestDTO, @Res() response) {
		try {
			const entity = await this.createUseCase.execute(body);
			const data = ListingAdapter.toHttp(entity);
			return response.status(201).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('list')
	@ApiOperation({ summary: 'List all Listings' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async list(@Res() response) {
		try {
			const entities = await this.listUseCase.execute();
			const data = entities.map((e) => ListingAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get(':id')
	@ApiOperation({ summary: 'Find Listing by ID' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async findById(@Param('id') id: string, @Res() response) {
		try {
			const entity = await this.findByIdUseCase.execute(id);
			const data = ListingAdapter.toHttp(entity!);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('owner/:ownerId')
	@ApiOperation({ summary: 'List Listings by Owner' })
	@ApiParam({ name: 'ownerId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByOwner(@Param('ownerId') ownerId: string, @Res() response) {
		try {
			const entities = await this.listByOwnerUseCase.execute(ownerId);
			const data = entities.map((e) => ListingAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Get('property/:propertyId')
	@ApiOperation({ summary: 'List Listings by Property' })
	@ApiParam({ name: 'propertyId' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async listByProperty(@Param('propertyId') propertyId: string, @Res() response) {
		try {
			const entities = await this.listByPropertyUseCase.execute(propertyId);
			const data = entities.map((e) => ListingAdapter.toHttp(e));
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Put(':id')
	@ApiOperation({ summary: 'Update Listing' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async update(@Param('id') id: string, @Body() body: UpdateListingRequestDTO, @Res() response) {
		try {
			const entity = await this.updateUseCase.execute({ id, data: body });
			const data = ListingAdapter.toHttp(entity);
			return response.status(200).json({ status: true, data });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete Listing' })
	@ApiParam({ name: 'id' })
	@ApiResponse({ status: 200 })
	@ApiResponse({ status: 400, type: HttpErrorResponseDTO })
	async delete(@Param('id') id: string, @Res() response) {
		try {
			await this.deleteUseCase.execute(id);
			return response.status(200).json({ status: true, data: { message: 'Listing deleted successfully' } });
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}
}


