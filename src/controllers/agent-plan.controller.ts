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
  CreateAgentPlanUseCase,
  UpdateAgentPlanUseCase,
  DeleteAgentPlanUseCase,
  ListAgentPlansUseCase,
  FindAgentPlanByIdUseCase,
} from '../usecases/agent-plan.usecases';
import {
  CreateAgentPlanRequestDTO,
  UpdateAgentPlanRequestDTO,
} from '../dto/agent-plan.dto';
import { AgentPlanAdapter } from '../adapters/agent-plan.adapter';

@ApiTags('Agent Plans')
@Controller('agent-plans')
export class AgentPlanController {
  constructor(
    private readonly createUseCase: CreateAgentPlanUseCase,
    private readonly updateUseCase: UpdateAgentPlanUseCase,
    private readonly deleteUseCase: DeleteAgentPlanUseCase,
    private readonly listUseCase: ListAgentPlansUseCase,
    private readonly findByIdUseCase: FindAgentPlanByIdUseCase
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new Agent Plan' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async create(@Body() body: CreateAgentPlanRequestDTO, @Res() response) {
    try {
      const entity = await this.createUseCase.execute(body);
      const data = AgentPlanAdapter.toHttp(entity);
      return response.status(201).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('list')
  @ApiOperation({ summary: 'List all Agent Plans' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async list(@Res() response) {
    try {
      const entities = await this.listUseCase.execute();
      const data = entities.map((e) => AgentPlanAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find Agent Plan by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async findById(@Param('id') id: string, @Res() response) {
    try {
      const entity = await this.findByIdUseCase.execute(id);
      const data = AgentPlanAdapter.toHttp(entity!);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Agent Plan' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAgentPlanRequestDTO,
    @Res() response
  ) {
    try {
      const entity = await this.updateUseCase.execute({ id, data: body });
      const data = AgentPlanAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Agent Plan' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async delete(@Param('id') id: string, @Res() response) {
    try {
      await this.deleteUseCase.execute(id);
      return response.status(200).json({
        status: true,
        data: { message: 'Agent plan deleted successfully' },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
