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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import { UploadService } from '../shared/providers/upload/upload.service';
import {
  CreatePropertyUseCase,
  DeletePropertyUseCase,
  FindPropertyByIdUseCase,
  ListPropertiesByCategoryUseCase,
  ListPropertiesByAgentUseCase,
  ListPropertiesUseCase,
  UpdatePropertyUseCase,
} from '../usecases/property.usecases';
import {
  CreatePropertyRequestDTO,
  UpdatePropertyRequestDTO,
} from '../dto/property.dto';
import { PropertyAdapter } from '../adapters/property.adapter';

@ApiTags('Properties')
@Controller('properties')
export class PropertyController {
  constructor(
    private readonly createUseCase: CreatePropertyUseCase,
    private readonly updateUseCase: UpdatePropertyUseCase,
    private readonly deleteUseCase: DeletePropertyUseCase,
    private readonly listUseCase: ListPropertiesUseCase,
    private readonly listByAgentUseCase: ListPropertiesByAgentUseCase,
    private readonly listByCategoryUseCase: ListPropertiesByCategoryUseCase,
    private readonly findByIdUseCase: FindPropertyByIdUseCase,
    private readonly uploadService: UploadService
  ) { }

  @Post('create')
  @ApiOperation({ summary: 'Create a new Property' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  async create(
    @Body() body: CreatePropertyRequestDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() response
  ) {
    try {
      console.log('[PropertyController] Create - Body (Raw):', body);
      console.log('[PropertyController] Create - Body (keys):', Object.keys(body));
      console.log('[PropertyController] Create - Files received:', files?.length || 0);

      if (files && files.length > 0) {
        console.log('[PropertyController] Files details:', files.map(f => ({
          fieldname: f.fieldname,
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size
        })));
      }

      if (files && files.length > 0) {
        console.log('[PropertyController] Uploading images to Cloudinary...');
        const imageUrls = await Promise.all(
          files.map((file) =>
            this.uploadService.uploadImage('properties', file)
          )
        );
        console.log('[PropertyController] Images uploaded URLs:', imageUrls);
        body.images = imageUrls;
      } else {
        console.log('[PropertyController] No files received or files empty.');
        console.log('[PropertyController] body.images type:', typeof body.images);
        console.log('[PropertyController] body.images value:', JSON.stringify(body.images, null, 2));

        // If images came in body instead of files, clear them
        if (body.images) {
          console.warn('[PropertyController] WARNING: Images came in body instead of as files! Clearing...');
          body.images = undefined;
        }
      }

      console.log('[PropertyController] Calling CreatePropertyUseCase...');
      const entity = await this.createUseCase.execute(body);
      console.log('[PropertyController] Property entity created successfully:', entity.id);

      const data = PropertyAdapter.toHttp(entity);
      return response.status(201).json({ status: true, data });
    } catch (error) {
      console.error('[PropertyController] Error creating property:', error);
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

  @Get('agent/:agentId')
  @ApiOperation({ summary: 'List Properties by Agent' })
  @ApiParam({ name: 'agentId' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async listByAgent(@Param('agentId') agentId: string, @Res() response) {
    try {
      const entities = await this.listByAgentUseCase.execute(agentId);
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
  async listByCategory(
    @Param('categoryId') categoryId: string,
    @Res() response
  ) {
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() body: UpdatePropertyRequestDTO,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Res() response
  ) {
    try {
      if (files && files.length > 0) {
        const imageUrls = await Promise.all(
          files.map((file) =>
            this.uploadService.uploadImage('properties', file)
          )
        );
        body.images = imageUrls;
      }
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
      return response.status(200).json({
        status: true,
        data: { message: 'Property deleted successfully' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
