import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AdminGuard } from '../shared/guards/admin.guard';
import type { Response } from 'express';
import {
  GetDashboardStatsUseCase,
  ListPendingPropertiesUseCase,
  ApprovePropertyUseCase,
  RejectPropertyUseCase,
  AdminCreateAgentUseCase,
  VerifyAgentUseCase,
} from '../usecases/admin.usecases';
import { RejectPropertyDTO, CreateAgentDTO } from '../dto/admin.dto';
import { PropertyAdapter } from '../adapters/property.adapter';
import { AgentAdapter } from '../adapters/agent.adapter';
import { UserAdapter } from '../adapters/user.adapter';
import { HttpErrorResponseDTO } from '../shared';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase,
    private readonly listPendingPropertiesUseCase: ListPendingPropertiesUseCase,
    private readonly approvePropertyUseCase: ApprovePropertyUseCase,
    private readonly rejectPropertyUseCase: RejectPropertyUseCase,
    private readonly createAgentUseCase: AdminCreateAgentUseCase,
    private readonly verifyAgentUseCase: VerifyAgentUseCase,
  ) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, type: HttpErrorResponseDTO })
  @ApiResponse({ status: 403, type: HttpErrorResponseDTO })
  async getDashboardStats(@Res() response: Response) {
    try {
      const stats = await this.getDashboardStatsUseCase.execute();
      return response.status(200).json({ status: true, data: stats });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Get('properties/pending')
  @ApiOperation({ summary: 'List properties pending approval' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, type: HttpErrorResponseDTO })
  @ApiResponse({ status: 403, type: HttpErrorResponseDTO })
  async listPendingProperties(@Res() response: Response) {
    try {
      const properties = await this.listPendingPropertiesUseCase.execute();
      const data = properties.map((p) => PropertyAdapter.toHttp(p));
      return response.status(200).json({ status: true, data });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Post('properties/:id/approve')
  @ApiOperation({ summary: 'Approve a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  @ApiResponse({ status: 401, type: HttpErrorResponseDTO })
  @ApiResponse({ status: 403, type: HttpErrorResponseDTO })
  async approveProperty(
    @Param('id') id: string,
    @Request() req,
    @Res() response: Response,
  ) {
    try {
      const property = await this.approvePropertyUseCase.execute({
        propertyId: id,
        adminId: req.user.id,
      });
      const data = PropertyAdapter.toHttp(property);
      return response.status(200).json({
        status: true,
        data,
        message: 'Property approved successfully',
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Post('properties/:id/reject')
  @ApiOperation({ summary: 'Reject a property' })
  @ApiParam({ name: 'id', description: 'Property ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  @ApiResponse({ status: 401, type: HttpErrorResponseDTO })
  @ApiResponse({ status: 403, type: HttpErrorResponseDTO })
  async rejectProperty(
    @Param('id') id: string,
    @Body() body: RejectPropertyDTO,
    @Request() req,
    @Res() response: Response,
  ) {
    try {
      const property = await this.rejectPropertyUseCase.execute({
        propertyId: id,
        adminId: req.user.id,
        reason: body.reason,
      });
      const data = PropertyAdapter.toHttp(property);
      return response.status(200).json({
        status: true,
        data,
        message: 'Property rejected successfully',
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Post('agents')
  @ApiOperation({ summary: 'Create a new agent (admin only)' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  @ApiResponse({ status: 401, type: HttpErrorResponseDTO })
  @ApiResponse({ status: 403, type: HttpErrorResponseDTO })
  async createAgent(@Body() body: CreateAgentDTO, @Res() response: Response) {
    try {
      const { user, agent } = await this.createAgentUseCase.execute(body);
      return response.status(201).json({
        status: true,
        data: {
          user: UserAdapter.toHttp(user),
          agent: AgentAdapter.toHttp(agent),
        },
        message: 'Agent created successfully',
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }

  @Post('agents/:id/verify')
  @ApiOperation({ summary: 'Verify an agent' })
  @ApiParam({ name: 'id', description: 'Agent ID' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 400, type: HttpErrorResponseDTO })
  @ApiResponse({ status: 401, type: HttpErrorResponseDTO })
  @ApiResponse({ status: 403, type: HttpErrorResponseDTO })
  async verifyAgent(@Param('id') id: string, @Res() response: Response) {
    try {
      const agent = await this.verifyAgentUseCase.execute(id);
      const data = AgentAdapter.toHttp(agent);
      return response.status(200).json({
        status: true,
        data,
        message: 'Agent verified successfully',
      });
    } catch (error) {
      return response.status(400).json({
        status: false,
        message: error.message,
      });
    }
  }
}
