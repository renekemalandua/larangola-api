import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminBroadcastEmailUseCase } from '../usecases/admin-email.usecases';
import { BroadcastEmailDTO } from '../dto/admin-email.dto';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { AdminGuard } from '../shared/guards/admin.guard';

@ApiTags('Admin Emails')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, AdminGuard)
@Controller('admin/emails')
export class AdminEmailController {
  constructor(
    private readonly broadcastEmailUseCase: AdminBroadcastEmailUseCase
  ) {}

  @Post('broadcast')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Send a broadcast email to users' })
  @ApiResponse({ status: 200, description: 'Broadcast sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid payload' })
  async broadcast(@Body() payload: BroadcastEmailDTO) {
    return this.broadcastEmailUseCase.execute(payload);
  }
}
