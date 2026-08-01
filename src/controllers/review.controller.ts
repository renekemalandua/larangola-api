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
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
  CreateReviewUseCase,
  UpdateReviewUseCase,
  DeleteReviewUseCase,
  ListReviewsUseCase,
  ListReviewsByPropertyUseCase,
  ListReviewsByToUserUseCase,
  FindReviewByIdUseCase,
  GetReviewStatsUseCase,
  ListMyReviewsUseCase,
} from '../usecases/review.usecases';
import {
  CreateReviewRequestDTO,
  UpdateReviewRequestDTO,
} from '../dto/review.dto';
import { ReviewAdapter } from '../adapters/review.adapter';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewController {
  constructor(
    private readonly createUseCase: CreateReviewUseCase,
    private readonly updateUseCase: UpdateReviewUseCase,
    private readonly deleteUseCase: DeleteReviewUseCase,
    private readonly listUseCase: ListReviewsUseCase,
    private readonly listByPropertyUseCase: ListReviewsByPropertyUseCase,
    private readonly listByToUserUseCase: ListReviewsByToUserUseCase,
    private readonly findByIdUseCase: FindReviewByIdUseCase,
    private readonly getStatsUseCase: GetReviewStatsUseCase,
    private readonly listMyReviewsUseCase: ListMyReviewsUseCase
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

  @Get('property/:propertyId')
  @ApiOperation({ summary: 'List Reviews by Property' })
  @ApiParam({ name: 'propertyId' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listByProperty(
    @Param('propertyId') propertyId: string,
    @Res() response
  ) {
    try {
      const entities = await this.listByPropertyUseCase.execute(propertyId); // Updated method usage
      const data = entities.map((e) => ReviewAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('user/:toUserId')
  @ApiOperation({ summary: 'List Reviews by To User' })
  @ApiParam({ name: 'toUserId' })
  @ApiQuery({ name: 'role', required: false, enum: ['AGENT', 'ROOMMATE'] })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listByToUser(
    @Param('toUserId') toUserId: string,
    @Query('role') role: string | undefined, // Explicitly typed as string | undefined
    @Res() response
  ) {
    try {
      const entities = await this.listByToUserUseCase.execute({
        toUserId,
        role,
      }); // Pass as object
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

  @Get('agent/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current agent review stats' })
  @ApiResponse({ status: 200 })
  async getStats(@Req() req, @Res() response) {
    try {
      const data = await this.getStatsUseCase.execute(req.user.id);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('agent/my-reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List detailed reviews for current agent' })
  @ApiResponse({ status: 200 })
  async getMyReviews(@Req() req, @Res() response) {
    try {
      const data = await this.listMyReviewsUseCase.execute(req.user.id);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
