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
import {
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import {
    CreatePropertyRequestUseCase,
    DeletePropertyRequestUseCase,
    FindPropertyRequestByIdUseCase,
    ListMyPropertyRequestsUseCase,
    ListPropertyRequestsUseCase,
    UpdatePropertyRequestUseCase,
} from '../usecases/property-request.usecases';
import {
    CreatePropertyRequestDTO,
    UpdatePropertyRequestDTO,
} from '../dto/property-request.dto';
import { PropertyRequestAdapter } from '../adapters/property-request.adapter';

@ApiTags('Property Requests')
@Controller('property-requests')
export class PropertyRequestController {
    constructor(
        private readonly createUseCase: CreatePropertyRequestUseCase,
        private readonly listUseCase: ListPropertyRequestsUseCase,
        private readonly listMyUseCase: ListMyPropertyRequestsUseCase,
        private readonly findByIdUseCase: FindPropertyRequestByIdUseCase,
        private readonly updateUseCase: UpdatePropertyRequestUseCase,
        private readonly deleteUseCase: DeletePropertyRequestUseCase
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new Property Request' })
    @ApiResponse({ status: 201 })
    @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
    async create(@Body() body: CreatePropertyRequestDTO, @Res() response) {
        try {
            const entity = await this.createUseCase.execute(body);
            const data = PropertyRequestAdapter.toHttp(entity);
            return response.status(201).json({ status: true, data });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get()
    @ApiOperation({ summary: 'List all Property Requests' })
    @ApiResponse({ status: 200 })
    @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
    async list(@Res() response) {
        try {
            const entities = await this.listUseCase.execute();
            const data = entities.map((e) => PropertyRequestAdapter.toHttp(e));
            return response.status(200).json({ status: true, data });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get('my/:userId')
    @ApiOperation({ summary: 'List My Property Requests' })
    @ApiParam({ name: 'userId' })
    @ApiResponse({ status: 200 })
    @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
    async listMy(@Param('userId') userId: string, @Res() response) {
        try {
            const entities = await this.listMyUseCase.execute(userId);
            const data = entities.map((e) => PropertyRequestAdapter.toHttp(e));
            return response.status(200).json({ status: true, data });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Find Property Request by ID' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
    async findById(@Param('id') id: string, @Res() response) {
        try {
            const entity = await this.findByIdUseCase.execute(id);
            const data = PropertyRequestAdapter.toHttp(entity!);
            return response.status(200).json({ status: true, data });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update Property Request' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
    async update(
        @Param('id') id: string,
        @Body() body: UpdatePropertyRequestDTO,
        @Res() response
    ) {
        try {
            const entity = await this.updateUseCase.execute({ id, data: body });
            const data = PropertyRequestAdapter.toHttp(entity);
            return response.status(200).json({ status: true, data });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Property Request' })
    @ApiParam({ name: 'id' })
    @ApiResponse({ status: 200 })
    @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
    async delete(@Param('id') id: string, @Res() response) {
        try {
            await this.deleteUseCase.execute(id);
            return response.status(200).json({
                status: true,
                data: { message: 'Property Request deleted successfully' },
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
