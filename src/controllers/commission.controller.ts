import { Controller, Post, Get, Body, Param, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { 
  CloseDealAndCalculateCommissionUseCase, 
  GetCommissionStatsUseCase, 
  GetCommissionHistoryUseCase 
} from '../usecases/commission.usecases';

@ApiTags('Commissions')
@Controller('commissions')
export class CommissionController {
  constructor(
    private readonly closeDealUseCase: CloseDealAndCalculateCommissionUseCase,
    private readonly getStatsUseCase: GetCommissionStatsUseCase,
    private readonly getHistoryUseCase: GetCommissionHistoryUseCase
  ) {}

  @Post('close-deal')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark property as closed and record commission' })
  async closeDeal(@Req() req: any, @Body() body: { propertyId: string; commissionAmount: number }) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User is not authenticated');
    }

    return this.closeDealUseCase.execute({
      propertyId: body.propertyId,
      userId: req.user.id,
      commissionAmount: body.commissionAmount
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get agent commission statistics' })
  async getStats(@Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User is not authenticated');
    }
    return this.getStatsUseCase.execute(req.user.id);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get agent commission history' })
  async getHistory(@Req() req: any) {
    if (!req.user || !req.user.id) {
      throw new BadRequestException('User is not authenticated');
    }
    return this.getHistoryUseCase.execute(req.user.id);
  }
}
