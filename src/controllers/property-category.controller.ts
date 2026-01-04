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
  CreatePropertyCategoryUseCase,
  UpdatePropertyCategoryUseCase,
  DeletePropertyCategoryUseCase,
  ListPropertyCategoriesUseCase,
  FindPropertyCategoryByIdUseCase,
} from '../usecases/property-category.usecases';
import {
  CreatePropertyCategoryRequestDTO,
  UpdatePropertyCategoryRequestDTO,
} from '../dto/property-category.dto';
import { PropertyCategoryAdapter } from '../adapters/property-category.adapter';

@ApiTags('Property Categories')
@Controller('property-categories')
export class PropertyCategoryController {
  constructor(
    private readonly createUseCase: CreatePropertyCategoryUseCase,
    private readonly updateUseCase: UpdatePropertyCategoryUseCase,
    private readonly deleteUseCase: DeletePropertyCategoryUseCase,
    private readonly listUseCase: ListPropertyCategoriesUseCase,
    private readonly findByIdUseCase: FindPropertyCategoryByIdUseCase
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new Property Category' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async create(
    @Body() body: CreatePropertyCategoryRequestDTO,
    @Res() response
  ) {
    try {
      const entity = await this.createUseCase.execute(body);
      const data = PropertyCategoryAdapter.toHttp(entity);
      return response.status(201).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List all Property Categories' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async list(@Res() response) {
    try {
      const entities = await this.listUseCase.execute();
      const data = entities.map((e) => PropertyCategoryAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find Property Category by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async findById(@Param('id') id: string, @Res() response) {
    try {
      const entity = await this.findByIdUseCase.execute(id);
      const data = PropertyCategoryAdapter.toHttp(entity!);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Property Category' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePropertyCategoryRequestDTO,
    @Res() response
  ) {
    try {
      const entity = await this.updateUseCase.execute({ id, data: body });
      const data = PropertyCategoryAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Property Category' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async delete(@Param('id') id: string, @Res() response) {
    try {
      await this.deleteUseCase.execute(id);
      return response.status(200).json({
        status: true,
        data: { message: 'Property category deleted successfully' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
