import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
  CreateReviewUseCase,
  UpdateReviewUseCase,
  DeleteReviewUseCase,
  ListReviewsUseCase,
  ListReviewsByListingUseCase,
  ListReviewsByToUserUseCase,
  FindReviewByIdUseCase,
} from '../usecases/review.usecases';
import {
  CreateReviewRequestDTO,
  UpdateReviewRequestDTO,
} from '../dto/review.dto';
import { ReviewAdapter } from '../adapters/review.adapter';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(
    private readonly createUseCase: CreateReviewUseCase,
    private readonly updateUseCase: UpdateReviewUseCase,
    private readonly deleteUseCase: DeleteReviewUseCase,
    private readonly listUseCase: ListReviewsUseCase,
    private readonly listByListingUseCase: ListReviewsByListingUseCase,
    private readonly listByToUserUseCase: ListReviewsByToUserUseCase,
    private readonly findByIdUseCase: FindReviewByIdUseCase
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new Review' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async create(@Body() body: CreateReviewRequestDTO, @Res() response) {
    try {
      const entity = await this.createUseCase.execute(body);
      const data = ReviewAdapter.toHttp(entity);
      return response.status(201).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List all Reviews' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async list(@Res() response) {
    try {
      const entities = await this.listUseCase.execute();
      const data = entities.map((e) => ReviewAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find Review by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async findById(@Param('id') id: string, @Res() response) {
    try {
      const entity = await this.findByIdUseCase.execute(id);
      const data = ReviewAdapter.toHttp(entity!);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('listing/:listingId')
  @ApiOperation({ summary: 'List Reviews by Listing' })
  @ApiParam({ name: 'listingId' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listByListing(@Param('listingId') listingId: string, @Res() response) {
    try {
      const entities = await this.listByListingUseCase.execute(listingId);
      const data = entities.map((e) => ReviewAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('user/:toUserId')
  @ApiOperation({ summary: 'List Reviews by To User' })
  @ApiParam({ name: 'toUserId' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listByToUser(@Param('toUserId') toUserId: string, @Res() response) {
    try {
      const entities = await this.listByToUserUseCase.execute(toUserId);
      const data = entities.map((e) => ReviewAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Review' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateReviewRequestDTO,
    @Res() response
  ) {
    try {
      const entity = await this.updateUseCase.execute({ id, data: body });
      const data = ReviewAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Review' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async delete(@Param('id') id: string, @Res() response) {
    try {
      await this.deleteUseCase.execute(id);
      return response.status(200).json({
        status: true,
        data: { message: 'Review deleted successfully' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
