import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
  Req
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpErrorResponseDTO } from '../shared';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import {
  CreatePropertyAuditRequestUseCase,
  GetPropertyAuditRequestUseCase,
  ListPendingPropertyAuditRequestsUseCase,
  ListMyPropertyAuditRequestsUseCase,
  ListMyValidationsUseCase,
  ClaimPropertyAuditRequestUseCase,
  ApprovePropertyAuditRequestUseCase,
  RejectPropertyAuditRequestUseCase,
  CancelPropertyAuditRequestUseCase,
} from '../usecases/property-audit-request.usecases';
import { CreatePropertyAuditRequestDTO } from '../dto/property-audit-request.dto';
import { PropertyAuditRequestAdapter } from '../adapters/property-audit-request.adapter';

@ApiTags('Property Audits')
@Controller('property-audits')
export class PropertyAuditRequestController {
  constructor(
    private readonly createUseCase: CreatePropertyAuditRequestUseCase,
    private readonly getUseCase: GetPropertyAuditRequestUseCase,
    private readonly listPendingUseCase: ListPendingPropertyAuditRequestsUseCase,
    private readonly listMySubmissionsUseCase: ListMyPropertyAuditRequestsUseCase,
    private readonly listMyValidationsUseCase: ListMyValidationsUseCase,
    private readonly claimUseCase: ClaimPropertyAuditRequestUseCase,
    private readonly approveUseCase: ApprovePropertyAuditRequestUseCase,
    private readonly rejectUseCase: RejectPropertyAuditRequestUseCase,
    private readonly cancelUseCase: CancelPropertyAuditRequestUseCase
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new Property Audit Request (Owner Submission)' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  async create(@Body() body: CreatePropertyAuditRequestDTO, @Res() response) {
    try {
      const entity = await this.createUseCase.execute(body);
      const data = PropertyAuditRequestAdapter.toHttp(entity);
      return response.status(201).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('pool')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all PENDING Property Audits' })
  @ApiResponse({ status: 200 })
  async listPending(@Res() response) {
    try {
      const entities = await this.listPendingUseCase.execute();
      const data = entities.map((e) => PropertyAuditRequestAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('my-validations/:agentId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List Property Audits claimed by Agent' })
  @ApiParam({ name: 'agentId' })
  @ApiResponse({ status: 200 })
  async listMyValidations(@Param('agentId') agentId: string, @Res() response) {
    try {
      const entities = await this.listMyValidationsUseCase.execute(agentId);
      const data = entities.map((e) => PropertyAuditRequestAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('my-submissions/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List Property Audits submitted by a specific User' })
  @ApiParam({ name: 'userId' })
  @ApiResponse({ status: 200 })
  async listMySubmissions(@Param('userId') userId: string, @Res() response) {
    try {
      const entities = await this.listMySubmissionsUseCase.execute(userId);
      const data = entities.map((e) => PropertyAuditRequestAdapter.toHttp(e));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a single Property Audit Request by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 200 })
  async getById(@Param('id') id: string, @Res() response) {
    try {
      const entity = await this.getUseCase.execute(id);
      const data = PropertyAuditRequestAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/claim')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Agent claims a Property Audit Request' })
  @ApiParam({ name: 'id' })
  async claim(@Param('id') id: string, @Body() body: { agentId: string }, @Res() response) {
    try {
      const entity = await this.claimUseCase.execute(id, body.agentId);
      const data = PropertyAuditRequestAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Agent approves a Property Audit Request' })
  @ApiParam({ name: 'id' })
  async approve(@Param('id') id: string, @Body() body: { agentId: string; categoryId: string }, @Res() response) {
    try {
      const newProperty = await this.approveUseCase.execute(id, body.agentId, body.categoryId);
      return response.status(200).json({ status: true, data: newProperty });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Agent rejects a Property Audit Request' })
  @ApiParam({ name: 'id' })
  async reject(@Param('id') id: string, @Body() body: { agentId: string; notes: string }, @Res() response) {
    try {
      const entity = await this.rejectUseCase.execute(id, body.agentId, body.notes);
      const data = PropertyAuditRequestAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Agent cancels claim, returning it to PENDING' })
  @ApiParam({ name: 'id' })
  async cancel(@Param('id') id: string, @Body() body: { agentId: string }, @Res() response) {
    try {
      const entity = await this.cancelUseCase.execute(id, body.agentId);
      const data = PropertyAuditRequestAdapter.toHttp(entity);
      return response.status(200).json({ status: true, data });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
